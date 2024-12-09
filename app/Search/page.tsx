import { text } from "stream/consumers";
import { PrismaClient} from '@prisma/client'
import { revalidatePath } from 'next/cache'



import react, {useState} from 'react'
import Alien from '../components/Alien'
const prisma = new PrismaClient()
let curRecipeName = ''
let curRecipeImage:any = null
let curRecipeSteps = ''
let curRecipeLikes = 0
let curRecipe:any

async function addLike(){
    'use server'
    await prisma.recipe.update({
        where:{
            recipeID:curRecipe.recipeID
        },
        data:{
            likes:curRecipeLikes+1
        }
    })
    revalidatePath("/")

}

async function handleSubmit(formData:FormData){
    'use server'
     var selRecipeName = formData.get('recipeSearch') as string

    curRecipe = await prisma.Recipe.findFirst({
        where:{
            recipeName: selRecipeName
        }
    })

    curRecipeName = curRecipe.recipeName
    curRecipeImage = curRecipe.image
    curRecipeLikes = curRecipe.likes
    curRecipeSteps = curRecipe.steps

    revalidatePath("/")
}

function displayRecipe(){
    return(
        <div className="DisplayedRecipe">
            <div className = 'searchRecipeName'>{curRecipeName}</div>
            <div className = 'searchRecipeSteps'>{curRecipeSteps}</div>
            
            <img className = 'searchRecipeImage' src = {curRecipeImage}></img>
            <div className="searchRecipeLikes"> likes: {curRecipeLikes}</div>
            <button className ='submitButton' onClick={addLike}>Like Recipe</button>
        </div>
        
    )
}

export default async function home(){
    return(
        <div className="addStepPage">
            <Alien/>
            
            <div className='formDirections'> Please enter a Recipe Name such as 'Alien Cake' below!
                 </div>
            <form action = {handleSubmit} >
                <input className = 'textInput'type="text" name="recipeSearch" id="recipeQueryInput" placeholder='Enter the recipe name here!' />
                <button className= "submitButton" id ="searchPageSubmit" type="submit">Submit</button>

            </form>
            {displayRecipe()}

        </div>
    )
}