<p align="center">
  <a href="https://github.com/win78py" target="blank"><img src="https://res.cloudinary.com/dekmn1kko/image/upload/v1726824769/artall_icon.png" width="100" alt="Artall Logo" /></a>
</p>

# Artall Gateway (`artall_gateway`)
**Artall** - Social network for designers.

## Description

Node.js/NestJS API gateway. It routes requests to microservices and handles auth.

### Overall Picture
<img width="500" height="auto" alt="image" src="https://github.com/user-attachments/assets/0329f15d-fb65-42f7-81a6-b7f515ec314a" />

### Architecture
<img width="800" height="auto" alt="image" src="https://github.com/user-attachments/assets/321b1ffd-4b81-48c9-866e-6159cfe7ac43" />


### Container Diagram
<img width="500" height="auto" alt="image" src="https://github.com/user-attachments/assets/d13d471b-76c2-47be-a068-c1433950d4e1" />

### Activity Diagram
<img width="700" height="auto" alt="image" src="https://github.com/user-attachments/assets/c7e859aa-84af-4818-9ea4-3a67541bccba" />

### ERD
<img width="600" height="auto" alt="image" src="https://res.cloudinary.com/dnjkwuc7p/image/upload/v1753435017/diagram-export-7-25-2025-3_41_37-PM_z3zncu.png" />


---

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

---
## Deploy
- CodePipeline + ECR + ECS (https://dev.to/aws-builders/setting-up-cicd-in-aws-with-codecommit-codedeploy-codepipeline-ecr-and-ecs-5g6b)




