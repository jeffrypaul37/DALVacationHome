
# DALVacationHome

DALVacationHome is a serverless, multi-cloud hotel room booking application that allows users to book rooms and provides property agents with the ability to add, edit, and manage room listings. The application also features a virtual assistant to answer user queries and a messaging system that enables communication between authorized users and agents.

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Architecture](#architecture)
- [Modules](#modules)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Demo

![Demo](https://github.com/jeffrypaul37/DALVacationHome/blob/main/DALVacationHome%20Demo.gif)

## Features
- **Guest Users**: Browse room availability, view tariffs, and access a virtual assistant for basic navigation and feedback.
- **Registered Customers**: Multi-factor authentication, room booking, virtual assistant support, and feedback submission.
- **Property Agents**: Admin capabilities to manage rooms, update features, and communicate with customers via messaging.

## Architecture
The application uses a multi-cloud deployment model with a combination of AWS and GCP services. It is built on a serverless architecture, ensuring scalability and efficiency.

### High-Level Architecture Diagram
![Architecture Diagram](https://github.com/jeffrypaul37/DALVacationHome/blob/main/DALVacationHome%20Architecture.png)

## Modules
### 1. User Management & Authentication
- **Registration**: AWS Cognito, DynamoDB, AWS Lambda
- **Multi-Factor Authentication**: Password, security questions, and Caesar cipher validation

### 2. Virtual Assistant
- **Bot Integration**: Google Dialogflow, DynamoDB, AWS Lambda
- **Functionality**: Navigation assistance, room details retrieval, and customer-agent communication

### 3. Message Passing
- **Pub/Sub Messaging**: GCP Pub/Sub for message exchange between customers and property agents
- **Logging**: DynamoDB or Firestore for communication logs

### 4. Notifications
- **Email Notifications**: AWS SNS and AWS SQS for registration, login, and booking confirmations
- **Queue Processing**: SQS-triggered Lambda functions for room booking approvals

### 5. Data Analysis & Visualization
- **Analytics Dashboard**: LookerStudio dashboard embedded within the frontend for property agents
- **Feedback Sentiment Analysis**: Google Natural Language API for analyzing customer feedback

### 6. Web Application & Deployment
- **Frontend**: React-based application hosted on GCP CloudRun
- **Deployment Automation**: CloudFormation or GCP Deployment Manager

## Technologies Used
- **Frontend**: React.js
- **Backend**: AWS Lambda, AWS Cognito, GCP Pub/Sub, GCP CloudRun
- **Database**: DynamoDB, Firestore
- **CI/CD**: CloudFormation, GCP Deployment Manager
- **Testing**: GCP Testing Tools, AWS Testing Tools
- **Analytics**: Google Natural Language API, LookerStudio
- **Messaging**: GCP Pub/Sub, AWS SQS
- **Notifications**: AWS SNS

## Setup Instructions
### Prerequisites
- Node.js and npm
- Access to AWS and GCP services

### Installation
1. Clone the repository
    ```bash
   git clone https://github.com/your-username/DALVacationHome.git
2. Navigate to the project directory:
   ```bash
    cd DALVacationHome
3. Install dependencies:
   ```bash
    npm install
4. Set up environment variables for AWS and GCP services.
5. Deploy the backend services using CloudFormation or GCP Deployment Manager.
6. Start the development server:
   ```bash
    npm start

## Usage
- Visit your deployed application at your CloudRun URL.
- Guest users can browse rooms and interact with the virtual assistant.
- Registered customers can log in, book rooms, and communicate with agents.
- Property agents can manage properties and respond to customer queries.

## Contributing
Contributions are welcome! Please create a pull request with your changes, and ensure that all tests pass before submitting.

## License
This project is licensed under the MIT License.
