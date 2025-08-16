import Brand from "../../models/brand";
import { Request, Response } from "express";

export async function addBrand(req: Request, res: Response): Promise<void> {

    const body = { ...req.body, slug: req.body.name.split(" ").join("-").toLowerCase() }
    const brand = new Brand(body)
    try {
        await brand.save()
        res.send(brand)
    } catch (err) {
        res.status(500).send({
            message: (err as Error).message,
        });
    }
}

export async function getAllBrands(req: Request, res: Response): Promise<void> {
    try {
        const brand = await Brand.find({}).sort({ _id: -1 })
        res.send({
            brand,
        })
    } catch (err) {
        res.status(500).send({
            message: (err as Error).message,
        });
    }
}