from google.cloud import pubsub_v1
import random
import json
import base64
import requests

#URL of API to update Agent for a ticket
update_agent_api_url = 'https://tnllxndel1.execute-api.us-east-1.amazonaws.com/Dev/ticket-agent'

#Url of API to get all all property agent details in pool
get_property_agents_url = 'https://1i8w3pbgsb.execute-api.us-east-1.amazonaws.com/prod/getPropertyAgents'

#Return List of Agent_Ids of all agents in the pool
def get_property_agents():
    try:
        response = requests.get(get_property_agents_url)
        response_data = response.json()
        
        if response.status_code == 200:
            property_agents = response_data.get('body', {}).get('PropertyAgents', [])
            return [agent['userId'] for agent in property_agents]
        #If no property agents are in the pool, log error and return []
        else:
            print(f"Failed to retrieve property agents, Status Code: {response.status_code}")
            return []

    #Log any errors while making API call
    except requests.exceptions.RequestException as e:
        print(f"Error retrieving property agents: {str(e)}")
        return []

#Randomly assign an agent from the pool to the ticket
def assign_agent_to_ticket(ticket_details):
    agents = get_property_agents()
    if not agents:
        print("No agents available to assign.")
        return

    assigned_agent = random.choice(agents)

    payload = {
        'Ticket_Number': ticket_details['Ticket_Number'],
        'Agent_Id': assigned_agent
    }

    try:
        # Make a put request to the update agent API
        response = requests.put(update_agent_api_url, json=payload)

        # Based on the response, log operation success or failure
        if response.status_code == 200:
            print(f'Agent assigned successfully for ticket {ticket_details["Ticket_Number"]}')
        else:
            print(f'Failed to assign agent for ticket {ticket_details["Ticket_Number"]}, Status Code: {response.status_code}')

#Log any error encountered while making request
    except requests.exceptions.RequestException as e:
        print(f'Error assigning agent for ticket {ticket_details["Ticket_Number"]}: {str(e)}')

#Process the message published by Pub Sub topic
def process_pubsub_message(event, context):
    try:
        # Decode the encrypted message
        message_data = base64.b64decode(event['data']).decode('utf-8')
        print(f"Received message data: {message_data}")
        
        # Parse the ticket details as Json
        ticket_details = json.loads(message_data)
        updated_ticket_details = assign_agent_to_ticket(ticket_details)
        
        #Log successful processing of messaging
        print(f"Processed message: {context.event_id}")

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON message: {str(e)}")
    except Exception as e:
        print(f"Error processing message: {str(e)}")
