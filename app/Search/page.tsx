
import { PrismaClient} from '@prisma/client'
import { revalidatePath } from 'next/cache'


import Alien from '../components/Alien'
const prisma = new PrismaClient()
let curRecipeName = ''
let curRecipeImage:string = ''
let curRecipeSteps = ''
let curRecipeLikes = 0
let curRecipe: { recipeID: number; recipeName: string; image: string; likes: number; steps: string } | null
async function addLike(){
    'use server'
    await prisma.recipe.update({
        where:{
            recipeID:curRecipe?.recipeID
        },
        data:{
            likes:curRecipeLikes+1
        }
    })
    revalidatePath("/")

}

async function handleSubmit(formData:FormData){
    'use server'
     const selRecipeName = formData.get('recipeSearch') as string
    //return the first recipe that matches the form data name
    curRecipe = await prisma.recipe.findFirst({
        where:{
            recipeName: selRecipeName
        }
    })

    //set displayed recipe to the current recipe attributres

    curRecipeName = curRecipe?.recipeName!
    curRecipeImage = curRecipe?.image!
    curRecipeLikes = curRecipe?.likes!
    curRecipeSteps = curRecipe?.steps!

    

    revalidatePath("/")
}

function displayRecipe(){
    return(
        <div className="DisplayedRecipe">
            <div className = 'databaseListHeader'>{curRecipeName}</div>
            <div className = 'searchRecipeSteps'>{curRecipeSteps}</div>
            
            <img className = 'searchRecipeImage' src = {curRecipeImage} alt = '' width = "100"
            ></img>
            <div className="searchRecipeLikes"> likes: {curRecipeLikes}</div>
            <button className ='submitButton' onClick={addLike}>Like Recipe</button>
        </div>
        
    )
}

export default async function home(){
    return(
        <div className="addStepPage">
            <Alien/>
            
            <div className='formDirections'> Please enter a Recipe Name such as Brocoli Soup below!
                 </div>
            <form action = {handleSubmit} >
                <input className = 'textInput'type="text" name="recipeSearch" id="recipeQueryInput" placeholder='Enter the recipe name here!' />
                <button className= "submitButton" id ="searchPageSubmit" type="submit">Submit</button>

            </form>
            {displayRecipe()}

        </div>
    )
}
