import Head from 'next/head'
import Error_layout from "../components/layout/error_layout";

export default function Home() {
  return (
      <Error_layout title="Dashboard">

          <h1 className="font-xl-3 font-weight-800">404</h1>
          <p>The page you are looking for does not exist or might have moved</p>

          <a className="btn btn-secondary" href="/">Go to home</a>

      </Error_layout>
  )
}
