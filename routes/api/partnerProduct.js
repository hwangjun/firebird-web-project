import express from "express";
import Joi from "@hapi/joi";
import partnerProduct from "../../models/product/PartnerProduct";

const router = express.Router();

/**
 * @swagger
 * /api/partnerProducts:
 *   get:
 *     summary: 협력사 상품 조회
 *     tags: [PartnerProduct]
 *     parameters:
 *       - in: path
 *         name: categoryCode
 *         type: integer
 *         required: true
 *         description: 카테고리코드
 *       - in: path
 *         name: offset
 *         type: integer
 *         required: false
 *         description: offset
 *         default: 0
 *       - in: path
 *         name: limit
 *         type: integer
 *         required: false
 *         description: limit
 *         default: 10
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
    categoryCode: Joi.number().required(),
    offset: Joi.number().default(0),
    limit: Joi.number().default(10)
  });

  const { error, value } = schema.validate(req.query);
  if (error) {
    responseResult.state = 400;
    responseResult.message = error;
  }

  if (200 == responseResult.state) {
    let query = {
      categoryCode: value.categoryCode
    };
    let skip = value.offset;
    let limit = value.limit;

    partnerProduct
      .findAll(query, skip, limit)
      .then(r => {
        responseResult.result = r;
      })
      .catch(err => {
        responseResult.state = 500;
        responseResult.message = "partnerProduct Search FAIL";
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
 *    /api/partnerProducts:
 *    post:
 *      summary: 협력사 상품 생성
 *      tags: [PartnerProduct]
 *      consumes:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: body
 *          description: 협력사 상품 정보
 *          required: true
 *          schema:
 *            type: object
 *            require:
 *              - productCode, productName, categoryCode
 *            properties:
 *              partnerCode:
 *                type: string
 *                example: TH201
 *              partnerProductCode:
 *                type: string
 *                example: a1234567
 *              partnerProductName:
 *                type: string
 *                example: test PartnerProduct
 *              categoryCode:
 *                type: integer
 *                example: 861
 *              productURL:
 *                type: string
 *                example: http://item.gmarket.co.kr/detailview/Item.asp?goodscode=727418053&pos_shop_cd=GE&pos_class_cd=100000068&pos_class_kind=L
 *              imgageURL:
 *                type: string
 *                example: http://gdimg.gmarket.co.kr/727418053/still/600?ver=1542697625
 *              price:
 *                type: integer
 *                example: 5000
 *      responses:
 *        200:
 *          description: OK
 */
router.post("/", (req, res, next) => {
  let responseResult = {
    state: 200,
    message: "",
    result: null
  };

  // validation 정의
  const schema = Joi.object({
    partnerCode: Joi.string().required(),
    partnerProductCode: Joi.string().required(),
    partnerProductName: Joi.string().required(),
    categoryCode: Joi.number(),
    productURL: Joi.string(),
    imageURL: Joi.string(),
    price: Joi.number()
  });

  // validation 체크
  const { error, value } = schema.validate(req.body);
  if (null != error) {
    responseResult.state = 400;
    responseResult.message = error;
  }

  if (200 == responseResult.state) {
    partnerProduct
      .create(value)
      .then(result => {
        responseResult.result = result;
      })
      .catch(err => {
        console.error("partnerProduct Add Error : ", err);
        responseResult.state = 500;
        responseResult.message = "partnerProduct Add FAIL";
      })
      .then(() => {
        res.status(responseResult.state).json(responseResult);
      });
    res.status(responseResult.state).json(responseResult);
  } else {
    res.status(responseResult.state).json(responseResult);
  }
});

/**
 *    @swagger
 *    /api/partnerProducts/{partnerCode}/{partnerProductCode}:
 *    delete:
 *      summary: 협력사 상품 제거
 *      tags: [PartnerProduct]
 *      parameters:
 *        - in: path
 *          name: partnerCode
 *          type: string
 *          description: 협력사 코드
 *        - in: path
 *          name: partnerProductCode
 *          type: string
 *          description: 협력사 상품 코드
 *      responses:
 *        200:
 *          description: OK
 */
router.delete("/:partnerCode/:partnerProductCode", (req, res) => {
  let responseResult = {
    state: 200,
    message: "",
    result: null
  };

  // validation 정의
  const schema = Joi.object({
    partnerCode: Joi.string().required(),
    partnerProductCode: Joi.string().required()
  });

  // 체크
  const { error, value } = schema.validate(req.params);
  if (null != error) {
    responseResult.state = 400;
    responseResult.message = error;
  }

  if (200 == responseResult.state) {
    partnerProduct
      .delete(value)
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
