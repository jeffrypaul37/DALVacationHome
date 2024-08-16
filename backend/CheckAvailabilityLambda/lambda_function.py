import json
import requests
from datetime import datetime

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
            room_no = data.get('room_no', '')
            room_name = data.get('room_name', '')
            start_date_str = data.get('start_date', '')
            end_date_str = data.get('end_date', '')

            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            except ValueError as ve:
                print(f"Date parsing error: {ve}")
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({"message": f"Invalid date format: {ve}"})
                }

            print("Parsed data:", {
                'room_no': room_no,
                'room_name': room_name,
                'start_date': start_date,
                'end_date': end_date
            })

            available = is_room_available(room_no, start_date, end_date)
            if available:
                response_body = {"message": "Room is available for the selected dates."}
                status_code = 200
            else:
                response_body = {"message": "Room is not available for the selected dates."}
                status_code = 400

            return {
                'statusCode': status_code,
                'headers': headers,
                'body': json.dumps(response_body)
            }

    except Exception as e:
        print("Error:", str(e))
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({"message": "Internal Server Error"})
        }

def is_room_available(room_no, start_date, end_date):
    try:
        api_url = "https://l15fomtb6d.execute-api.us-east-1.amazonaws.com/prod/getAllBookings"
        response = requests.get(api_url)
        print("GetAllBookings API response status:", response.status_code)
        print("GetAllBookings API response body:", response.text)

        if response.status_code == 200:
            bookings = json.loads(response.text).get('body', {}).get('bookings', [])
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
