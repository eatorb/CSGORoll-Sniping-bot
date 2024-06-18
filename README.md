# CS:GO Roll Sniping Bot

## Introduction
The CS:GO Empire Sniping Bot is designed to automate the process of sniping items with low markup percentages on CS:GORoll. Users can purchase these items through the bot and resell them at a higher markup to achieve a profit. The bot leverages WebSocket connections, Docker, and modern web technologies to provide a robust and user-friendly experience.

## Features
- **Item Sniping**: Automatically buys items with the lowest markup percentage.
- **WebSocket Integration**: Uses WebSocket for real-time communication.
- **Dockerized Application**: Each user instance runs in a separate Docker container, ensuring scalability and isolation.
- **Authentication**: Secured with JWT-based authentication.
- **Email Verification**: Supports email verification for user authentication.
- **CSGORoll Integration**: Users must provide a cookie from CSGORoll to interact with the platform.

## Technology Stack
- **WebSocket**: Real-time data handling.
- **Express.js**: Application framework.
- **MySQL**: Database management.
- **Prisma ORM**: Database operations.
- **Docker**: Containerization.
- **JWT**: Authentication.
- **Node.js**: Server-side logic.

## Prerequisites
- Docker
- Node.js
- MySQL Server
- A valid CSGORoll account with cookie access


## Modules
- **Client WebSocket**: Connects to CSGORoll WebSocket for real-time item tracking.
- **API**: Handles all backend logic and interactions.
- **WebSocket Server**: Manages all WebSocket connections for the bot operations. (WIP)

## Disclaimer
This bot is intended for educational purposes only. Usage of this bot for sniping items on CSGORoll might violate their terms of service. Users should ensure they comply with all applicable laws and terms of service.
