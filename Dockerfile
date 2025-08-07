# Use an official Node.js runtime as a parent image.
# Using the 'alpine' variant for a smaller image size.
FROM node:20-alpine

# Install git, which is necessary to clone the repository.
# --no-cache cleans up the package manager cache to keep the image small.
RUN apk add --no-cache git

# Set the working directory in the container.
# All subsequent commands (RUN, CMD, etc.) will be executed from this directory.
WORKDIR /app

# Install pnpm globally in the container.
RUN npm install -g pnpm

# --- Environment Variable Setup ---
# Declare a build-time argument. You will pass your key to this argument
# when you run the 'docker build' command.
ARG OPENAI_API_KEY_ARG

# --- Application Setup ---
# Clone your specific GitHub repository into the current working directory (/app).
RUN git clone https://github.com/saviobatista/vitae.git .

# Create the .env.local file and write the API key to it.
# This command takes the value from the build argument and saves it inside the container.
# It's important that this file is created before the build/run step of your app.
RUN echo "OPENAI_API_KEY=${OPENAI_API_KEY_ARG}" > .env.local


# Install project dependencies using pnpm.
# pnpm will read the package.json and pnpm-lock.yaml files to install the exact versions.
RUN pnpm install

# Expose the port the app runs on.
# The vitae project uses Vite, which defaults to port 5173.
# This makes the port accessible from outside the container.
EXPOSE 5173

# Define the command to run your app.
# This will start the development server when the container starts.
CMD ["pnpm", "dev"]

# Use:
# docker run -p 5173:3000 vitae
# to run it.
