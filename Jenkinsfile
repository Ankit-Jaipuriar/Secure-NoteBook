pipeline {
  agent any

  environment {
    // Directly setting the MongoDB URI without using Jenkins credentials
    MONGO_URI = 'mongodb+srv://ankitkumarjaipuriar:0JdYcca7cB9qxZEo@cluster1.xbv7o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1'
  }

  stages {
    stage('Clone Repo') {
      steps {
        git 'https://github.com/Ankit-Jaipuriar/Secure-Notebook-Docker.git'
      }
    }

    stage('Build Docker Images') {
      steps {
        sh 'docker-compose build'
      }
    }

    stage('Run Containers') {
      steps {
        script {
          // Passing the MONGO_URI environment variable to the containers
          withEnv(["MONGO_URI=${MONGO_URI}"]) {
            sh 'docker-compose up -d'
          }
        }
      }
    }
  }
}
