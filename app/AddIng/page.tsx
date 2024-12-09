import { PrismaClient} from '@prisma/client'

import { revalidatePath } from 'next/cache'
import Alien from '../components/Alien'
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode, Key } from 'react'
const prisma = new PrismaClient()

async function addToDB(formData:FormData){
    
    'use server'
    let ingredient = formData.get("ingredient") as string
    let selectedTagName = formData.get("tagsDropDown") as string
    const curTag = await prisma.Tag.findFirst({
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
                            tagID:curTag.tagID
                        }
                    }
                }
            }
        }
    })
    revalidatePath("/")

}

async function tagIDtoName(TagID: number){
    let currentTag = await prisma.Tag.findUnique({
        where:{
            tagID:TagID
        }
    })
    return currentTag.tagName
}


async function ingIDtoName(IngID: number){
    let currentIng = await prisma.ingredient.findUnique({
        where:{
            ingredientID:IngID
        }
    })
    return currentIng.ingredientName
}





export default async function Home() {
    const ingsl = await prisma.Tag2Ing.findMany();
    const tagsl = await prisma.Tag.findMany();
    
    //drop down menu options
    const tagel = tagsl.map((Tag: { tagName:Key}) => <option key = {Tag.tagName}>{Tag.tagName}</option>)
    const ingel = ingsl.map((Tag2Ing: { tag: Key | null | undefined; ingredientIDscalar: any; tagIDscalar: any }) => <li key={Tag2Ing.tag}>Name: {ingIDtoName(Tag2Ing.ingredientIDscalar)} - Tag: {tagIDtoName(Tag2Ing.tagIDscalar)}</li>)
   
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
            <div className="databaseListHeader">Ingredients:{ingel}</div>
        </div>
    )
}
