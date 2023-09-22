const Ads = require("../models/Ads");
const secret = require("../secret");
const jwt = require("jsonwebtoken");

class adsControler {
  async findAddAllUser(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = jwt.verify(token, secret);
      const allUserAds = await Ads.findAll({
        where: {
          userId: id,
        },
      });
      if (allUserAds) res.status(200).json({ ...allUserAds });
      if (!allUserAds)
        res.status(200).json({
          message: "Error findAdd",
        });
    } catch (e) {
      res.status(200).json({
        message: "Error findAdd",
      });
    }
  }
  async findAll(req, res) {
    try {
      const allUserAds = await Ads.findAll({});
      if (allUserAds) res.status(200).json({ ...allUserAds });
      if (!allUserAds)
        res.status(200).json({
          message: "Error findAll",
        });
    } catch (e) {
      res.status(200).json({
        message: "Error findAll",
      });
    }
  }

  async addAds(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = jwt.verify(token, secret);
      const { title, text, price, phone, category } = req.body;
      if (title && text && price && phone && category) {
        await Ads.create({
          userId: id,
          title: title,
          text: text,
          price: price,
          phone: phone,
          category: category,
        });
        return res.status(200).json({ message: "oK" });
      } else {
        res.status(200).json({ message: "Error addAds" });
      }
    } catch (e) {
      res.status(200).json({ message: "Error addAds" });
    }
  }

  async updateAds(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = jwt.verify(token, secret);
      const { title, text, price, phone, category } = req.body;
      await Ads.update(
        {
          title: title,
          text: text,
          price: price,
          phone: phone,
          category: category,
        },
        {
          where: {
            userId: id,
          },
        }
      );

      return res.status(200).json({ message: "oK" });
    } catch (e) {
      res.status(200).json({ message: "Error addAds" });
    }
  }

  async deleteAds(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const { id } = jwt.verify(token, secret);
      const { idAsd } = req.body;
      const deletes = await Ads.destroy({
        where: {
          userId: id,
          id: idAsd,
        },
      });
      if (deletes) {
        return res.status(200).json({ message: "oK" });
      } else {
        res.status(404).json({ message: "Error deleteAds" });
      }
    } catch (e) {
      res.status(404).json({ message: "Error addAds" });
    }
  }
}

module.exports = new adsControler();
