const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

async function main(){
    const gross = await prisma.Tag.upsert({
        where:{tagID:0},
        update:{},
        create:{
            tagName:'Gross',
            ingredients:{
                create:[
                    {
                        ingredient:{
                            create:{
                                ingredientName:'Raisin'
                            }
                        }
                    },
                    {
                        ingredient:{
                            create:{
                                ingredientName:'Califlower'
                            }
                        }
                    },
                    {
                        ingredient:{
                            create:{
                                ingredientName:'Brocoli'
                            }
                        }
                    }
                ]
            }
        }
    })
    const weird = await prisma.Tag.upsert({
        where:{tagID:0},
        update:{},
        create:{
            tagName:'Wierd',
            ingredients:{
                create:[
                    {  
                        ingredient:{
                            create:{
                                ingredientName:'Crow feather'
                            }
                        }
                        
                    },
                    {
                        ingredient:{
                            create:{
                                ingredientName:'Alien Feet'
                            }
                        }
                    },
                    {
                        ingredient:{
                            create:{
                                ingredientName:'Crow feather'
                            }
                        }
                    }
                ]
            }
        }
    })
    console.log({gross, weird})
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })