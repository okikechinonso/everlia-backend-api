import Brand from "../../models/brand";
import { Request, Response } from "express";

export async function addBrand(req: Request, res: Response): Promise<void>{
    const brand = new Brand(req.body)
    try {
        await brand.save()
        res.send({
        message: "Brand Added Successfully!"
    })
    }catch(err) {
        res.status(500).send({
            message: (err as Error).message,
        });
    }   
}

export async function getAllBrands(req: Request, res: Response): Promise<void>{
    try {
        const brand = await Brand.find({}).sort({_id: -1})
        res.send({
        brand,
    })
    }catch(err) {
        res.status(500).send({
            message: (err as Error).message,
        });
    }   
}