pipeline {
  agent any

  environment {
    MONGO_URI = credentials('mongodb+srv://ankitkumarjaipuriar:0JdYcca7cB9qxZEo@cluster1.xbv7o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1') // Jenkins secret
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
        sh 'MONGO_URI=$MONGO_URI docker-compose up -d'
      }
    }
  }
}
