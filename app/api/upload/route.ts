import { existsSync } from "fs";
import { mkdir, writeFile, unlink } from "fs/promises";

import { NextRequest, NextResponse } from "next/server";
import { join } from "path";


export async function POST(request: Request) {
    try {
        // Récupérer le fichier depuis la requête
        const data = await request.formData();
        
    const file: File | null = data.get("file") as unknown as File ;

    if(!file){
        return NextResponse.json({success: false})
    }
    //permet de convertir le fichier en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    //permet de créer un dossier uploads dans le dossier public
    const uploadDir = join(process.cwd(), "public", "uploads")
    if(!existsSync(uploadDir)){
        await mkdir(uploadDir, {recursive: true})
    }
    
    const ext = file.name.split(".").pop()
    const uniqueName = crypto.randomUUID() + "." + ext
    //crée un fichier dans le dossier uploads
    const filePath = join(uploadDir, uniqueName)
    //Ecrit le fichier dans le dossier uploads
    await writeFile(filePath, buffer);
    const publicPath = `/uploads/${uniqueName}`

    return NextResponse.json({success: true, filePath: publicPath})
        
    } catch (error) {
        console.error(error)
    }
}

// DELETE 
export async function DELETE(request: Request) {
    try {
        const {path} = await request.json()
        if(!path){
            return NextResponse.json({success: false, message: "Chemin du fichier requis"}, {status: 400})
        }

        const filePath = join(process.cwd(), "public", path)
        if(!existsSync(filePath)){
           return NextResponse.json({success: false, message: "Fichier introuvable"}, {status: 404})
        }
        
        await unlink(filePath)
        return NextResponse.json({success: true, message: "Fichier supprimé avec succès"})
        
    } catch (error) {
        console.error(error)
    }
}