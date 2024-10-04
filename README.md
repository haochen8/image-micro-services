Picture It - Assignment B3

This project is a solution for Assignment B3 - Picture It, where I have implemented a system consisting of three microservices: Auth Service, Resource Service, and an already deployed Image Service. These services work together to handle user authentication, resource management, and image storage.

Project Overview

The system consists of the following components:

	1.	Auth Service: Manages user authentication and provides JWT tokens.
	2.	Resource Service: Handles the creation, updating, and deletion of resources (image metadata) and communicates with the Image Service for actual image storage.
	3.	Image Service: Responsible for storing images and serving them via a public URL.

The architecture has been designed to provide secure access using JWT tokens and ensures that the Resource Service handles image metadata, while the actual image data is managed by the Image Service. Users can upload, update, and delete images using RESTful endpoints provided by the Resource Service.

System Architecture
Services Overview

1. Auth Service

	•	The Auth Service handles user registration and login.
	•	Upon successful login, users are issued a JWT token.
	•	This token is required for accessing protected routes in the Resource Service.

For further details, please refer to the Auth Service documentation and issue #10.

2. Resource Service

	•	The Resource Service is the main service that users interact with after authentication.
	•	It manages image metadata such as image URLs, descriptions, and titles.
	•	The service interacts with the Image Service to store and retrieve actual image data, which is provided in Base64 format.

For more information, refer to the Resource Service documentation and issue #11.

3. Image Service

	•	The Image Service is pre-deployed and stores all images used by the system.
	•	The Resource Service communicates with this service via an API to add, update, or delete images.
	•	Important considerations:
	•	Images must be sent in Base64 encoded format.
	•	Payload size is limited to 500kb.
	•	The image URL is stored in the Resource Service, and the actual image is served via the Image Service’s public interface.

You can access the Image Service at:

	•	API: Image Service API
	•	Documentation: Image Service Documentation

How It Works

	1.	The client tries to access the Resource Service without authentication, receiving a 403 Forbidden response.
	2.	The client registers an account and logs in using the Auth Service, which provides a JWT token.
	3.	The client can now use the JWT token to interact with the Resource Service to upload, update, or delete image resources.
	4.	The Resource Service communicates with the Image Service to store images and returns the resource metadata, including the image URL, to the client.
	5.	The client can use the URL provided by the Resource Service to retrieve the image from the Image Service.

Assignment Deliverables

In this project, the assignment-routes.json file has been completed, with the necessary references to:

	•	My server address.
	•	My student username.

No additional code has been added to this repository. It contains configuration for testing and file storage.

Testing

The system has been tested using Postman and Curl. I verified that:

	•	The Auth Service successfully registers users and provides JWT tokens.
	•	The Resource Service correctly handles image metadata and communicates with the Image Service to store images.
	•	The Image Service stores and serves images as expected.

Requirements and Issues

I have implemented and closed the required issues for this assignment, including issues related to user authentication, resource management, and image storage. Please review the following issues for more details:

	•	#1 - #11: Issues cover the required and optional functionalities for the services. These issues have been marked as implemented or closed.

Ensure to check the full list of requirements and the corresponding issues.

How to Run the Project

	1.	Clone the repository.
	2.	Set up the environment variables, including:
	•	DB_CONNECTION_STRING for MongoDB.
	•	BASE_URL and PORT for running the services.
	•	JWT_SECRET for token encryption.
	•	Access token for the Image Service.
	3.	Run the microservices (Auth and Resource services) locally or deploy them to a cloud platform.
	4.	Test the endpoints using Postman or Curl.

Author

	•	Hao Chen
	•	Version: 1.0.0
	•	Contact: haoooochen@gmail.com

License

This project is licensed under the MIT License.

Thank you for reviewing my project!