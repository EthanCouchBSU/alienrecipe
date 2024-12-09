import Link from "next/link";

export default function Home() {
    return (
      <nav>
        <div className ="title">
          <h1>Alien Recipe</h1>
        </div>
        <Link href = "/">Generate Recipe</Link>
        <Link href = "/Search">Search Recipes</Link>
        
        <Link href = "/AddIng">Add Ingredient</Link>
        <Link href = "/AddStep">Add a Step</Link>
      </nav>
    );
  }