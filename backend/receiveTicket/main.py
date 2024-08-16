from google.cloud import pubsub_v1
import json
from flask import jsonify, request


publisher = pubsub_v1.PublisherClient()


topic_path = publisher.topic_path('csci5410t30', 'unassigned-tickets') 


def receive_ticket(request):
    if request.method == 'POST':
        ticket_details = request.get_json()

       
        try:
            publish_ticket_details(ticket_details)
            return 'Ticket details published to Pub/Sub', 200
        except Exception as e:
            return f'Error publishing ticket details: {str(e)}', 500

    return 'Method not allowed', 405


def publish_ticket_details(ticket_details):
    data = json.dumps(ticket_details).encode('utf-8')

    future = publisher.publish(topic_path, data=data)
    future.result()  

    print(f'Message published to Pub/Sub topic: {topic_path}')
