pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('deploy') {
      steps {
        sh 'cp test /home/anon/Desktop'
      }
    }

  }
}