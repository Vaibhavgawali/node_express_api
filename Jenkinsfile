pipeline{
    agent any
     environment {
        PORT = '5000'
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
                script {
                    // def exitCode = bat returnStatus: true, script: 'npm start', 
                    //     env: [
                    //         PORT: params.PORT, 
                    //         CONNECTION_STRING: params.CONNECTION_STRING, 
                    //         DB_USER: params.DB_USER, 
                    //         DB_PASS: params.DB_PASS, 
                    //         JWT_KEY: params.JWT_KEY
                    //     ]
                    // if (exitCode == 0) {
                    //     currentBuild.result = 'SUCCESS'
                    // } else {
                    //     echo "Failed to start application"
                    //     error "Failed to start application"
                    // }
                     bat returnStatus: true, script: 'npm start', 
                        args: [
                            params.PORT, 
                            env.CONNECTION_STRING, 
                            env.DB_USER, 
                            env.DB_PASS, 
                            env.JWT_KEY
                        ]
                    if (batExitCode == 0) {
                        currentBuild.result = 'SUCCESS'
                    } else {
                        echo "Failed to start application"
                        error "Failed to start application"
                    }
                }
            }
        }
        // stage('Start Application'){
        //     // steps {
        //     //     bat 'npm start ${params.PORT} ${params.CONNECTION_STRING} ${params.DB_USER} ${params.DB_PASS} ${params.JWT_KEY}' 
        //     // }
        //     steps {
        //         // script {
        //         //     def exitCode = bat returnStatus: true, script: "npm start ${env.PORT} ${env.CONNECTION_STRING} ${env.DB_USER} ${env.DB_PASS} ${env.JWT_KEY}"
        //         //     if (exitCode == 0) {
        //         //         currentBuild.result = 'SUCCESS'
        //         //     } else {
        //         //         error "Failed to start application"
        //         //     }
        //         // }
        //         steps {
        //             script {
        //                 def exitCode = bat returnStatus: true, script: "npm start ${params.PORT} ${params.CONNECTION_STRING} ${params.DB_USER} ${params.DB_PASS} ${params.JWT_KEY}"
        //                 if (exitCode == 0) {
        //                     currentBuild.result = 'SUCCESS'
        //                 } else {
        //                     error "Failed to start application"
        //                 }
        //             }
        //         }
        //     }
        // }
    }
}
