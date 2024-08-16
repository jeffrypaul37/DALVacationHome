import json
import requests
import boto3
from datetime import datetime

sns_client = boto3.client('sns', region_name='us-east-1')

def lambda_handler(event, context):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true'
    }
    
    print("Received event:", json.dumps(event))
       
    try:
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': ''
            }

        if 'body' in event:
            data = json.loads(event['body'])
            room = data.get('room', '')
            start_date_str = data.get('startDate', '')
            end_date_str = data.get('endDate', '')
            user_id = data.get('userId', '')
            user_name = data.get('userName', '')
            user_email = data.get('userEmail', '')
            room_name = data.get('roomName', '')
            room_image = data.get('roomImage', '')
            room_desc = data.get('roomDesc', '')
            price = data.get('price', '')

            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            except ValueError as ve:
                print(f"Date parsing error: {ve}")
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps(f"Invalid date format: {ve}")
                }

            print("Parsed data:", {
                'room': room,
                'start_date': start_date,
                'end_date': end_date,
                'user_id': user_id,
                'user_name': user_name,
                'user_email': user_email,
                'room_name': room_name,
                'room_image': room_image,
                'room_desc': room_desc,
                'price': price
            })

            available = is_room_available(room, start_date, end_date)
            if not available:
                manage_subscription_and_send_email(user_email, user_name, room_name, start_date, end_date, price, success=False)
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps('Room is not available for the selected dates.')
                }

            payload = {
                "user_id": user_id,
                "user_name": user_name,
                "user_email": user_email,
                "room_no": room,
                "room_name": room_name,
                "room_image": room_image,
                "room_desc": room_desc,
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "price": price
            }

            api_url = "https://thsp2zvsv6.execute-api.us-east-1.amazonaws.com/prod/createBooking"
            response = requests.post(api_url, json=payload)
            print("AddBooking API response status:", response.status_code)
            print("AddBooking API response body:", response.text)

            if response.status_code == 200:
                manage_subscription_and_send_email(user_email, user_name, room_name, start_date, end_date, price, success=True)
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps('Booking successful!')
                }
            else:
                manage_subscription_and_send_email(user_email, user_name, room_name, start_date, end_date, price, success=False)
                return {
                    'statusCode': response.status_code,
                    'headers': headers,
                    'body': response.text
                }

    except Exception as e:
        print("Error:", str(e))
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps('Internal Server Error')
        }

def is_room_available(room_no, start_date, end_date):
    try:
        api_url = "https://l15fomtb6d.execute-api.us-east-1.amazonaws.com/prod/getAllBookings"
        response = requests.get(api_url)
        print("GetAllBookings API response status:", response.status_code)
        print("GetAllBookings API response body:", response.text)

        if response.status_code == 200:
            bookings = response.json().get('body', {}).get('bookings', [])
            for booking in bookings:
                try:
                    booking_start_date = datetime.strptime(booking['start_date'], '%Y-%m-%d').date()
                    booking_end_date = datetime.strptime(booking['end_date'], '%Y-%m-%d').date()
                    if booking['room_no'] == room_no and not (end_date < booking_start_date or start_date > booking_end_date):
                        return False
                except ValueError as ve:
                    print(f"Date parsing error for booking: {ve}")
            return True
        else:
            print("Failed to fetch bookings:", response.text)
            return False

    except Exception as e:
        print("Error checking room availability:", str(e))
        return False

def send_booking_email(user_email, user_name, room_name, start_date, end_date, price, success):
    try:
        subject = 'Booking Confirmation' if success else 'Booking Unsuccessful'
        message = (
            f"Hello {user_name},\n\n"
            f"{'Your booking for' if success else 'Unfortunately, your booking for'} {room_name} from {start_date} to {end_date} "
            f"{'has been confirmed.' if success else 'could not be completed because the room is not available. Please try booking for different dates or a different room.'}\n\n"
            f"{'Thank you for booking with us.' if success else ''}\n"
            f"{'For more details, visit our website or contact us.' if success else 'We apologize for the inconvenience.'}"
        )
        
        sns_client.publish(
            TopicArn='arn:aws:sns:us-east-1:047970323441:BookingNotifications',
            Message=message,
            Subject=subject
        )
        print("Email sent successfully")

    except Exception as e:
        print("Error sending email:", str(e))

def manage_subscription_and_send_email(user_email, user_name, room_name, start_date, end_date, price, success):
    try:
        topic_arn = 'arn:aws:sns:us-east-1:047970323441:BookingNotifications'
        
        response = sns_client.list_subscriptions_by_topic(TopicArn=topic_arn)
        subscriptions = response.get('Subscriptions', [])

        for subscription in subscriptions:
            if subscription['Endpoint'] != user_email:
                sns_client.unsubscribe(SubscriptionArn=subscription['SubscriptionArn'])
        
        sns_client.subscribe(
            TopicArn=topic_arn,
            Protocol='email',
            Endpoint=user_email
        )
        
        send_booking_email(user_email, user_name, room_name, start_date, end_date, price, success)

    except Exception as e:
        print("Error managing subscriptions:", str(e))
