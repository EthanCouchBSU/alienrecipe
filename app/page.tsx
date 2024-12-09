

import { PrismaClient} from '@prisma/client'
import { revalidatePath } from 'next/cache'
import Alien from './components/Alien'
import react from 'react'


const prisma = new PrismaClient()

let generatedRecipe = ''
let curIngList: string[] = []
let recipeNameInput = ''
let imageLinkInput = ''
function randInt(min:number, max:number){
  return Math.floor(Math.random() *(max-min+1)) +min
}
//return how many steps there are
const stepCount = await prisma.RecipeStep.count()


async function getIngredientsByTag(TagID:number){
  
  const selectedIng = await prisma.Ingredient.findMany({
    where:{
      tags:{
        some:{
          tag:{
            tagID:TagID
          }
        }
      }
    }
  })
  
  curIngList = selectedIng.map((ingredient: { ingredientName: string }) => ingredient.ingredientName)
  
  
}

function pickRandomWord(){
  const randomIndex =  Math.floor(Math.random()*curIngList.length)
  return curIngList[randomIndex]
}


async function handleSubmit(formData:FormData){
  'use server'
  

  let numStep = formData.get('numOfSteps') as unknown as number
  const tag = formData.get("recipeTags") as string
  
  
  let currentStep
  
  const curTag = await prisma.Tag.findFirst({
    where:{
        tagName:tag
    }
})

  //set list of ingredients to pick from 
    getIngredientsByTag(curTag.tagID)

  //form adjusting
  if (numStep <=1){
    numStep = 1
  }else if (numStep > 20){
    numStep = 20
  }
  //get x random steps, and add them to the recipe
  for(let i = 0; i <= numStep; i++){
    currentStep = await prisma.RecipeStep.findFirst({
    where:{
      stepID:randInt(15,15+stepCount -1)
    }
  })
  
    //replace with random word
    generatedRecipe = generatedRecipe.replace(new RegExp('ing','g'), pickRandomWord)
  //append to string
    generatedRecipe += currentStep.step +=". "
  
  }
  

  
  
  
  revalidatePath("/")
}

function updateText(text:string){
  return {__html: text};
}

async function saveToDb(formData:FormData){
  'use server'
  recipeNameInput = formData.get('recipeNameInput') as string
  imageLinkInput = formData.get('recipeImageInput') as string
//form check
  if (recipeNameInput == null){
    recipeNameInput = ''
  }

  if (imageLinkInput == null){
    imageLinkInput = ''
  }
  
  await prisma.Recipe.create({
    data:{
      recipeName:recipeNameInput,
      image:imageLinkInput,
      likes:0,
      steps:generatedRecipe

    }
  })

  generatedRecipe = ''
  revalidatePath("/")

}
export default async function Home() {
  const tagsl = await prisma.Tag.findMany();
    
    //drop down menu options
  const tagel = tagsl.map((Tag: { tagName:react.Key}) => <option key = {Tag.tagName}>{Tag.tagName}</option>)
  return (
    <div className="addStepPage">
      <Alien/>
      <div className='formDirections'>To add to the recipe, please select how many steps to use, and a
        tag to use.
      </div>

      <form action = {handleSubmit}>
        <input type='number' name='numOfSteps' placeholder='Enter number of steps here!'></input>
        <select name="recipeTags" className='tagDropDown'>
          {tagel}
        </select>
        <button className= "submitButton" id ="generatePageSubmit" type="submit">Submit</button>

      </form>
      <div className="databaseListHeader">Recipe Results:</div>
      <div className = 'recipetext' dangerouslySetInnerHTML={updateText(generatedRecipe)}></div>

      <div className="databaseListHeader">Save Recipe here!</div>
      <form action = {saveToDb}>
        <label className= "textLabel"htmlFor = "recipeNameInput">Recipe Name:</label>
        <input className='textInput' type = "text" name = "recipeNameInput" placeholder='Enter name for recipe here!'></input>
        <br></br>
        <label className= "textLabel"htmlFor = "recipeImageInput">Recipe Image</label>
        <input className='textInput'type = "text" name = "recipeImageInput" placeholder='Enter a link for an image here!'></input>
        <br></br>
        <button className= "submitButton" id ="generateRecipeSubmit" type="submit">Submit</button>

        
      </form>

    </div>
  );
}
