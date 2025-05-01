import { Request, Response } from "express";
import Currency from "../../models/Currency";
import { Currency as CurrencyType } from "../../types/currency";

export const addCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    const newCurrency = new Currency(req.body);
    await newCurrency.save();
    res.send({
      message: "Currency added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const addAllCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    await Currency.insertMany(req.body);
    res.send({ message: "All Currencies added successfully!" });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getAllCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    const currencies = await Currency.find({});
    res.send(currencies);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getShowingCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    const currencies = await Currency.find({ status: "show" }).sort({ _id: -1 });
    res.send(currencies);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getCurrencyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const currency = await Currency.findById(req.params.id);
    res.send(currency);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    const currency = await Currency.findById(req.params.id);

    if (currency) {
      currency.name = req.body.name;
      currency.symbol = req.body.symbol;
      currency.status = req.body.status;
      currency.live_exchange_rates = req.body.live_exchange_rates;

      await currency.save();
      res.send({
        message: "Currency updated successfully!",
      });
    } else {
      res.status(404).send({ message: "Currency not found!" });
    }
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateManyCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    await Currency.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: {
          status: req.body.status,
          live_exchange_rates: req.body.live_exchange_rates,
        },
      },
      {
        multi: true,
      }
    );

    res.send({
      message: "Currencies updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateEnabledStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const newStatus = req.body.status;

    await Currency.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.status(200).send({
      message: `Currency ${
        newStatus === "show" ? "Published" : "Un-Published"
      } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateLiveExchangeRateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const newStatus = req.body.live_exchange_rates;

    await Currency.updateOne(
      { _id: req.params.id },
      {
        $set: {
          live_exchange_rates: newStatus,
        },
      }
    );
    res.status(200).send({
      message: `Currency ${
        newStatus === "show" ? "Published" : "Un-Published"
      } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const deleteCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    await Currency.deleteOne({ _id: req.params.id });
    res.send({
      message: "Currency deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const deleteManyCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    await Currency.deleteMany({ _id: req.body.ids });
    res.send({
      message: "Currencies deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};