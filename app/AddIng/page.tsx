import { PrismaClient} from '@prisma/client'
import { connect } from 'http2'
import { revalidatePath } from 'next/cache'
const prisma = new PrismaClient()

async function addToDB(formData:FormData){
    
    'use server'
    var ingredient = formData.get("ingredient") as string
    var selectedTagName = formData.get("tagsDropDown") as string
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

async function tagIDtoName(TagID){
    var currentTag = await prisma.Tag.findUnique({
        where:{
            tagID:TagID
        }
    })
    return currentTag.tagName
}


async function ingIDtoName(IngID){
    var currentIng = await prisma.ingredient.findUnique({
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
    const tagel = tagsl.map((Tag) => <option>{Tag.tagName}</option>)
    const ingel = ingsl.map((Tag2Ing) => <li key={Tag2Ing.tag}>Name: {ingIDtoName(Tag2Ing.ingredientIDscalar)} - Tag: {tagIDtoName(Tag2Ing.tagIDscalar)}</li>)
   
      return(
        <div className="addStepPage">
            <div className='formDirections'>
                Please enter an ingredient and select a tag from the drop down menu.
            </div>

            <form action = {addToDB}>
                <input type="text" name="ingredient" id="ingQueryInput" placeholder='Enter the ingredient here!' />
                <label htmlFor="tagsDropDown">Tag:</label>
                <select name="tagsDropDown" className='tagDropDown'>
                    {tagel}
                </select>
                <button className= "submitButton" id ="addIngredientPageSubmit" type="submit">Submit</button>

                <div className="databaseListHeader">Ingredients:{ingel}</div>

            </form>

        </div>
    )
}
