pipeline{
    agent any
     environment {
        PORT = '3000'
        CONNECTION_STRING = credentials('CONNECTION_STRING')
        DB_USER = credentials('DB_USER')
        DB_PASS = credentials('DB_PASS')
        JWT_KEY = credentials('JWT_KEY')
    }
    tools {nodejs "NodeJS"}
    stages {
        stage('Clone Repository'){
            steps{
                git branch: 'main',
                    url: 'https://github.com/Vaibhavgawali/node_express_api.git'
            }
        }
        
        stage('Install Dependencies'){
            steps {
                bat 'npm install'
            }
        }
        
        stage('Start Application'){
            steps {
                bat 'npm start' 
            }
        }
    }
}
