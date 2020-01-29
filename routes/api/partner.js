// const router = require('express').Router();
// const Partner = require('../../models/product/Partner');
import express from "express";
const router = express.Router();

/**
 * @swagger
 * /api/partner/:
 *   get:
 *     summary: 모든 협력사 조회
 *     tags: [Partner]
 *     responses:
 *       200:
 *         description: 성공
 */
router.get('/', (req, res) => {
    Partner.findAll().then((partner) => {
        if (!partner.length) return res.status(404).send({ err: 'Partner not found' });
        res.send(partner);
    })
    .catch(err => res.status(500).send(err));
});

/**
 * @swagger
 * /api/partner/{partnerCode}:
 *   get:
 *     summary: 특정 협력사 조회
 *     tags: [Partner]
 *     parameters:
 *       - in: path
 *         name: partnerCode
 *         type: string
 *         required: true
 *         description: |
 *          협력사 코드
 *     responses:
 *       200:
 *         description: 성공
 */
router.get('/:partnerCode', (req, res) => {
    Partner.findByPartnerCode(req.params.partnerCode).then((partner) => {
      if (!partner) return res.status(404).send({ err: 'Partner not found' });
        res.send(partner);
    })
    .catch(err => res.status(500).send(err));
});

/**
*    @swagger
*    /api/partner:
*    post:
*      summary: 협력사 생성
*      tags: [Partner]
*      consumes:
*        - application/x-www-form-urlencoded
*      parameters:
*        - in: formData
*          name: partnerCode
*          type: string
*          description: 협력사 코드
*        - in: formData
*          name: partnerName
*          type: string
*          description: 협력사명
*        - in: formData
*          name: companyName
*          type: string
*          description: 회사명
*      responses:
*        200:
*          description: OK
*/
router.post('/', (req, res) => {
    Partner.create(req.body)
        .then(partner => res.send(partner))
        .catch(err => res.status(500).send(err));
});

/**
*    @swagger
*    /api/partner:
*    patch:
*      summary: 협력사 수정
*      tags: [Partner]
*      consumes:
*        - application/x-www-form-urlencoded
*      parameters:
*        - in: formData
*          name: partnerCode
*          type: string
*          description: 협력사 코드
*        - in: formData
*          name: partnerName
*          type: string
*          description: 협력사명
*        - in: formData
*          name: companyName
*          type: string
*          description: 회사명
*      responses:
*        200:
*          description: OK
*/
router.patch('/', (req, res) => {
    Partner.update(req.body)
        .then(partner => res.send(partner))
        .catch(err => res.status(500).send(err));
});

/**
*    @swagger
*    /api/partner:
*    delete:
*      summary: 협력사 제거
*      tags: [Partner]
*      consumes:
*        - application/x-www-form-urlencoded
*      parameters:
*        - in: formData
*          name: partnerCode
*          type: string
*          description: 협력사 코드
*      responses:
*        200:
*          description: OK
*/
router.delete('/', (req, res) => {
    Partner.delete(req.body.partnerCode)
        .then(partnerCode => res.send(partnerCode))
        .catch(err => res.status(500).send(err));
});

// module.exports = router;
export default router;