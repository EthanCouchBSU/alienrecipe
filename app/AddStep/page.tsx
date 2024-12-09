// form validation not required

import { PrismaClient} from '@prisma/client'

import { revalidatePath } from 'next/cache'
import Alien from '../components/Alien'


import react from 'react'



const prisma = new PrismaClient()


//add entered step database on form submit
async function addToDB(formData:FormData){
    'use server'
    const value = formData.get("step") as string

    await prisma.recipeStep.create({
        data:{
            step:value
        }
    })

    revalidatePath("/")

}

/*
//remove all steps from database on form submit
async function truncateSteps(){
    'use server'
    
    await prisma.RecipeStep.deleteMany({where: {}})
    revalidatePath("/")
}

async function getStep(stepID: string){
    const step = await prisma.RecipeStep.findUniqueOrThrow({
        where:{
            stepID: parseInt(stepID)
        }
    })
    return step
    }
*/

export default async function home(){
    
    //get list of steps
    const stepsl = await prisma.recipeStep.findMany();
    const stepel = stepsl.map((recipeStep: { step:react.Key}
    ) => <li key={recipeStep.step}> {recipeStep.step}</li>)
    return(
        <div className = 'addStepPage'>
            <Alien/>
            <div className='formDirections'>
                Please enter a cooking instruction. Include ing to be replaced
                with an ingredient. Ex: bake the ing for 30 minutes.
            </div>
        
            <form action = {addToDB}>
                <input className = 'textInput'type='text' name='step' id='stepQueryInput' placeholder='Enter the step here!' />
                <button className= 'submitButton' id ='addStepPageSubmit' type="submit">Submit</button>
            </form>

            
            
            <div className='databaseListHeader'>Steps:</div>
            <div className = 'dbList'>{stepel}</div>
            
        </div>
    )
}