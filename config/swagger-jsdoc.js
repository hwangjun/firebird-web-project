// var swaggerJSDoc = require('swagger-jsdoc');

// var options = {
//   swaggerDefinition: {
//     info: {
//       title: 'Hello World', // Title (required)
//       version: '1.0.0', // Version (required)
//     },
//   },
//   apis: ['./routes.js'], // Path to the API docs
// };

// // Initialize swagger-jsdoc -> returns validated swagger spec in json format
// var swaggerSpec = swaggerJSDoc(options);

'use strict';

module.exports = {
  swaggerDefinition: {
    // 정보
    info: {
      title: 'firebird product blog',
      version: '1.0.0',
      description: 'We stole DNW\'s product database.'
    },
    // 주소
    host: "localhost:3000",
    // 기본 root path
    basePath: "/",
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      },
    },
    // security: [
    //   { jwt: [] }
    // ],
    contact: {
      email: "ajo1115@gmail.com"
    },
    // 각 api에서 설명을 기록할 때 사용할 constant들을 미리 등록해놓는것
    components: {
      res: {
        BadRequest: {
          description: '잘못된 요청.',
          schema: {
            $ref: '#/components/errorResult/Error'
          }
        },
        Forbidden: {
          description: '권한이 없슴.',
          schema: {
            $ref: '#/components/errorResult/Error'
          }
        },
        NotFound: {
          description: '없는 리소스 요청.',
          schema: {
            $ref: '#/components/errorResult/Error'
          }
        }
      },
      errorResult: {
        Error: {
          type: 'object',
          properties: {
            errMsg: {
              type: 'string',
              description: '에러 메시지 전달.'
            }
          }
        }
      }
    },
    schemes: ["http", "https"], // 가능한 통신 방식
    definitions: { // 모델 정의 (Category 모델에서 사용되는 속성 정의)
        'Category': {
            type: 'object',
            properties: {
                categoryCode: { type: 'string' },
                parentCategoryCode: { type: 'string' },
                categoryName: { type: 'string' },
                depth: { type: 'string' }
            }
        }
    }
  },
  //   apis: ['./routes/**/*.js']
  apis: ['./routes/api/*.js'] // api 파일 위치들
};