pipeline{
    agent any
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
