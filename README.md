
---

# ENVOY-KEYCLOAK INTEGRATION POC

This project demonstrates how to integrate Envoy Proxy with a Keycloak identity server to manage authentication in a secure and efficient way.

## Objective

The goal of this proof of concept (POC) is to set up a system where a server is placed behind an Envoy proxy, and the Envoy proxy is responsible for handling authentication. Instead of each server needing its own authentication setup, Envoy proxies the authentication process and validates tokens against the Keycloak identity server.

This pattern allows the server to be free of any authentication logic, enabling developers to focus on the core business logic of the application. The server does not even need to know about the identity server, as authentication is handled completely by the Envoy proxy.

## RUN keycloak on kubenretes cluster

First of all go to keycloak folder deploy keycloak and postgress db on cluster with below command.

    kubectl apply -f keycloak-postgres.yaml

    get the external ip and port of keycloak service and open this service from browser. "http://external-ip-address-keycloak:<port>" 

    and use credentail for "user: admin and password: admin".

    now go inside the keycloak and take secret under credentail section and add that secret in "client's dockerfile as env" like(client>dockerfile>env)


## RUN Envoy on kubenretes cluster

Second go to envoy folder and deploy envoy on kubernetes cluster. Before this take "external ip address for keycloak service and add in envoy configmap under **issuer , remote jwt uri and keycloak cluster backend**

then apply below command for running envoy on kubernetes cluster.

  kubectl apply -f envoy-kubernetes-file.yml

## RUN BACKEND SERVER

  go inside the server folder and use below command to run backend server.

  k apply -f deployment.yaml

## RUN Client 

  go inside the client folder under "client.js"

### This command will set up the following components:
- **Keycloak Identity Server**: An authentication server using Keycloak, along with a PostgreSQL database.
- **Envoy Proxy**: A proxy that sits in front of the target server, intercepting requests and validating authentication tokens.
- **Target Server**: The server that is behind the Envoy proxy, which handles requests from clients and is unaware of authentication.

## Keycloak Identity Server

Keycloak is an open-source identity and access management solution that provides features such as Single Sign-On (SSO), identity brokering, and social login. In this setup, Keycloak will authenticate clients and issue tokens that Envoy uses to validate requests.

### Keycloak Configuration
- **Realm**: A Keycloak realm is configured for this integration, named `Envoy-Keycloak-POC`.
- **Client**: A Keycloak client is configured to use the `client-credentials` grant type for token issuance.
  
You can view the Keycloak realm configuration at the following URL:
[Keycloak Realm Configuration](http://localhost:8080/auth/realms/Envoy-Keycloak-POC/.well-known/openid-configuration)

### Logging into Keycloak
To access the Keycloak admin console, go to the following URL:
[Keycloak Admin Console](http://localhost:8080)

Log in using the credentials:
- **Username**: `admin`
- **Password**: `admin`

## Server

The target server is located behind the Envoy proxy. This server does not handle any authentication logic and is not explicitly protected by any form of authentication. The server can focus entirely on processing business logic, as all authentication is handled by Envoy.

You can find the server's code in the file:  
[Server Code](./server/server.js)

## Envoy Proxy

Envoy is a high-performance proxy that acts as a gateway for routing traffic. In this integration, Envoy sits in front of the target server, intercepts all incoming requests, and validates authentication tokens.

- Envoy checks the token in the request against the Keycloak server.
- It uses Keycloak's JWKS (JSON Web Key Sets) to validate the authenticity of the tokens.

Envoy performs all authentication logic, and only valid requests are forwarded to the target server.

### Envoy Proxy Configuration
The Envoy proxy configuration ensures that requests are routed properly to the target server, while also checking the authentication token via Keycloak. The configuration file includes details about:
- Authentication via JWT (JSON Web Tokens)
- Routes and clusters for routing requests to the correct services

## Client

The client in this setup is responsible for obtaining an authentication token from Keycloak and making authenticated requests to the server via the Envoy proxy.

To run the client, follow these steps:
1. Navigate to the **`./client`** directory.
2. Run the following command to start the client:

```bash
npm start
```

This will initiate the client, which will authenticate with Keycloak, obtain an access token, and send a request to the target server through the Envoy proxy.

## Manual Testing with cURL Commands

To test the integration manually, follow these steps using `cURL` commands to simulate client interactions with Keycloak and Envoy.

### 1. Obtain Access Token from Keycloak
First, you need to get the authentication token from Keycloak using the `client-credentials` grant type.

Run the following `cURL` command to obtain the token:

```bash
curl -L --insecure -s -X POST 'http://localhost:8080/realms/Envoy-Keycloak-POC/protocol/openid-connect/token' \
-H 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id=poc-client' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'client_secret=0427f0fd-197a-412e-a036-a40136680831'
```

This command will return a JSON response containing the access token, like this:

```json
{
  "access_token": "your-access-token",
  "expires_in": 3600,
  "token_type": "bearer"
}
```

### 2. Use the Access Token to Call the Envoy Proxy

Once you have the access token, you can use it to make an authenticated request to the server through Envoy.

Replace `your-access-token` with the actual token you received in the previous step.

Run the following `cURL` command to make an authenticated GET request:

```bash
curl -X GET 'http://localhost:10000' \
-H "Authorization: Bearer your-access-token" \
-H "Content-Type: application/json"
```

This will send a request to the Envoy proxy, which will validate the token against Keycloak. If the token is valid, the request will be forwarded to the target server.

## Conclusion

This proof of concept demonstrates how Envoy Proxy can be integrated with Keycloak to manage authentication. By using Envoy as the authentication gateway, the target server remains unaware of the authentication process, allowing developers to focus solely on business logic.

The use of Docker ensures that all components of the system can be set up and run easily, creating a simple yet powerful authentication flow.

If you have any questions or need further assistance, feel free to reach out!

---

### Key Changes & Additions:
1. **Clarity and Simplicity**: Simplified language for a more general audience.
2. **Detailed Steps**: Added clear and concise steps for manual testing using cURL.
3. **Configuration**: Included more detailed information on what each component (Keycloak, Envoy, Server) does.
4. **Additional Explanations**: Broke down how each component fits into the overall authentication flow. 
