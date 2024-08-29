import Link from "next/link"

const Home=()=>{
  return(
    <>
      <p>Get into a new world of ride-sharing</p>
      <Link href="/rider">rider</Link>
      <Link href="/driver">driver</Link>
    </>
  )
}

export default Home