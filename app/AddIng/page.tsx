import { PrismaClient} from '@prisma/client'

import { revalidatePath } from 'next/cache'
import Alien from '../components/Alien'
import {Key } from 'react'
const prisma = new PrismaClient()

async function addToDB(formData:FormData){
    
    'use server'
    const ingredient = formData.get("ingredient") as string
    const selectedTagName = formData.get("tagsDropDown") as string
    const curTag = await prisma.tag.findFirst({
        where:{
            tagName:selectedTagName
        }
    })
//create a new ingredient, and link the tag to it under the many to many table.
    await prisma.ingredient.create({
        data:{
            ingredientName:ingredient,
            tags:{
                create:{
                    tag:{
                        connect:{
                            tagID:curTag?.tagID
                        }
                    }
                }
            }
        }
    })
    revalidatePath("/")

}
/* vercel was being an absolute pain with eslint on variable assignment here,
*/

async function tagIDtoName(TagID: number){
    const currentTag = await prisma.tag.findUnique({
        where:{
            tagID:TagID
        }
    })
    return currentTag?.tagName
}


async function ingIDtoName(IngID: number){
    const currentIng = await prisma.ingredient.findUnique({
        where:{
            ingredientID:IngID
        }
    })
    return currentIng?.ingredientName
}





export default async function Home() {
    const ingsl = await prisma.tag2Ing.findMany();
    const tagsl = await prisma.tag.findMany();
    
    //drop down menu options
    const tagel = tagsl.map((Tag: { tagName:Key}) => <option key = {Tag.tagName}>{Tag.tagName}</option>)
    //const ingel = ingsl.map((Tag2Ing: { tag: Key | null | undefined; ingredientIDscalar: number; tagIDscalar: number }) => <li key={tag2Ing.tag}>Name: {(ingIDtoName(Tag2Ing.ingredientIDscalar)).getValue()} - Tag: {tagIDtoName(Tag2Ing.tagIDscalar)}</li>)


    const ingel = ingsl.map((Tag2Ing) => <li key = {Tag2Ing.ingredientIDscalar}>{ingIDtoName(Tag2Ing.ingredientIDscalar)} - Tag: {tagIDtoName(Tag2Ing.tagIDscalar)}</li>)
      return(
        <div className="addStepPage">
            <Alien/>
            <div className='formDirections'>
                Please enter an ingredient and select a tag from the drop down menu.
            </div>
            
            <form action = {addToDB}>
                <input className='textInput'type="text" name="ingredient" id="ingQueryInput" placeholder='Enter the ingredient here!' />
                <label htmlFor="tagsDropDown">Tag:</label>
                <select name="tagsDropDown" className='tagDropDown'>
                    {tagel}
                </select>
                <button className= "submitButton" id ="addIngredientPageSubmit" type="submit">Submit</button>

                

            </form>
            {ingel}
            
        </div>
    )
}
