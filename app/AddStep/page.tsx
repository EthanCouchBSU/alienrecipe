// form validation not required

import { PrismaClient} from '@prisma/client'
import { revalidatePath } from 'next/cache'
import Alien from '../components/Alien'


import react, {useState} from 'react'



const prisma = new PrismaClient()


//add entered step database on form submit
async function addToDB(formData:FormData){
    'use server'
    var value = formData.get("step") as string

    await prisma.RecipeStep.create({
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
*/
async function getStep(stepID: string){
    const step = await prisma.RecipeStep.findUniqueOrThrow({
        where:{
            stepID: parseInt(stepID)
        }
    })
    return step
    }


export default async function home(){
    
    //get list of steps
    const stepsl = await prisma.RecipeStep.findMany();
    const stepel = stepsl.map((RecipeStep: { stepId: react.Key | null | undefined; step: string | number | bigint | boolean | react.ReactElement<any, string | react.JSXElementConstructor<any>> | Iterable<react.ReactNode> | react.ReactPortal | Promise<react.AwaitedReactNode> | null | undefined }
    ) => <li key={RecipeStep.stepId}> {RecipeStep.step}</li>)
    return(
        <div className = "addStepPage">
            <Alien/>
            <div className='formDirections'>
                Please enter a cooking instruction. Include ing to be replaced
                with an ingredient. Ex: "bake the ing for 30 minutes.""
            </div>
        
            <form action = {addToDB}>
                <input className = 'textInput'type="text" name="step" id="stepQueryInput" placeholder='Enter the step here!' />
                <button className= "submitButton" id ="addStepPageSubmit" type="submit">Submit</button>
            </form>

            
            
            <div className="databaseListHeader">Steps:{stepel}</div>
            
        </div>
    )
}