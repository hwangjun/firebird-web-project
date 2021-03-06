import express from "express";
const router = express.Router();
import Joi from "@hapi/joi";
import Prod from "../../models/product/Product";

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: 상품 조회
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productName
 *         type: string
 *         require: false
 *         description: 상품명조회
 *       - in: path
 *         name: categoryCode
 *         type: integer
 *         require: false
 *         description: 카테고리코드
 *       - in: path
 *         name: offset
 *         type: integer
 *         require: false
 *         description: offset
 *         default: 0
 *       - in: path
 *         name: limit
 *         type: integer
 *         require: false
 *         description: limit
 *         default: 10
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: 성공
 */
router.get("/", (req, res) => {
  let responseResult = {
    state: 200,
    message: "",
    result: null
  };

  // validation 정의
  const schema = Joi.object({
    productName: Joi.string(),
    categoryCode: Joi.number(),
    offset: Joi.number().default(0),
    limit: Joi.number().default(10)
  });

  // 체크
  const { error, value } = schema.validate(req.query);
  if (error) {
    responseResult.state = 400;
    responseResult.message = error;
  }

  if (200 == responseResult.state) {
    let query = {};
    let skip = value.offset;
    let limit = value.limit;

    if (value.productName) {
      // like
      query["productName"] = { $regex: ".*" + value.productName + ".*" };
    }

    if (value.categoryCode) {
      query["categoryCode"] = value.categoryCode;
    }

    Prod.findAll(query, skip, limit)
      .then(r => {
        responseResult.result = r;
      })
      .catch(err => {
        responseResult.state = 500;
        responseResult.message = "productList Search FAIL";
      })
      .then(() => {
        res.status(responseResult.state).json(responseResult);
      });
  } else {
    res.status(responseResult.state).json(responseResult);
  }
});

/**
 * @swagger
 * /api/products/{productCode}:
 *   get:
 *     summary: 특정 상품 조회
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productCode
 *         type: integer
 *         required: true
 *         description: 상품코드
 *     responses:
 *       200:
 *         description: 성공
 */
router.get("/:productCode", (req, res) => {
  let responseResult = {
    state: 200,
    message: "",
    result: null
  };

  // validation 정의
  const schema = Joi.object({
    productCode: Joi.number()
  });

  // 체크
  const { error, value } = schema.validate(req.params);
  if (error) {
    responseResult.state = 400;
    responseResult.message = error;
  }

  if (200 == responseResult.state) {
    Prod.findByProductCode(value.productCode)
      .then(result => {
        responseResult.result = result;
      })
      .catch(err => {
        responseResult.result = err;
        responseResult.state = 500;
      })
      .then(() => {
        res.status(responseResult.state).json(responseResult);
      });
  } else {
    res.status(responseResult.state).json(responseResult);
  }
});

/**
 *    @swagger
 *    /api/products:
 *    post:
 *      summary: 상품 생성
 *      tags: [Product]
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: body
 *          description: 상품 정보
 *          require: true
 *          schema:
 *            type: object
 *            require:
 *              - productCode, productName, categoryCode
 *            properties:
 *              productCode:
 *                type: integer
 *                example: 1111
 *              productName:
 *                type: string
 *                example: 테스트상품
 *              categoryCode:
 *                type: integer
 *                example: 861
 *      responses:
 *        200:
 *          description: OK
 */
router.post("/", (req, res, next) => {
  /**
    {
        "productCode": 11,
        "productName": "test Product",
        "categoryCode": 861
    }
   */

  let responseResult = {
    state: 200,
    message: "",
    result: null
  };

  // validation 정의
  const schema = Joi.object({
    productCode: Joi.number().required(),
    productName: Joi.string().required(),
    categoryCode: Joi.number().required()
  });

  // validation 체크
  const { error, value } = schema.validate(req.body);
  if (null != error) {
    responseResult.state = 400;
    responseResult.message = error;
  }

  if (200 == responseResult.state) {
    let newProd = {
      productCode: value.productCode,
      productName: value.productName,
      categoryCode: value.categoryCode
    };

    Prod.create(newProd)
      .then(result => {
        responseResult.result = result;
      })
      .catch(err => {
        console.error("product Add Error : ", err);
        responseResult.state = 500;
        responseResult.message = "product Add FAIL";
      })
      .then(() => {
        res.status(responseResult.state).json(responseResult);
      });
  } else {
    res.status(responseResult.state).json(responseResult);
  }
});

/**
 *    @swagger
 *    /api/products/{productCode}:
 *    delete:
 *      summary: 상품 제거
 *      tags: [Product]
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: productCode
 *          type: integer
 *          description: 상품코드
 *      responses:
 *        200:
 *          description: OK
 */
router.delete("/:productCode", (req, res) => {
  let responseResult = {
    state: 200,
    message: "",
    result: null
  };

  // validation 정의
  const schema = Joi.object({
    productCode: Joi.number()
  });

  // 체크
  const { error, value } = schema.validate(req.params);
  if (null != error) {
    responseResult.state = 400;
    responseResult.message = error;
  }

  if (200 == responseResult.state) {
    Prod.delete(value.productCode)
      .then(result => {
        responseResult.result = result;
      })
      .catch(err => {
        responseResult.state = 500;
        responseResult.message = "product DELETE FAIL";
      })
      .then(() => {
        res.status(responseResult.state).json(responseResult);
      });
  } else {
    res.status(responseResult.state).json(responseResult);
  }
});

export default router;
