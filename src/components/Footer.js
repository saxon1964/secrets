import * as React from 'react'
import * as Utils from '../misc/utils.js'

const Footer = () => {
  return (
    <div className="container bg-warning p-2">
      <b>My Secrets ver. {Utils.APP_VERSION}.</b> Copyright &copy; 2022 Saša Marković. Check my movie site at <a href="https://www.luka.in.rs" target="_blank">www.luka.in.rs</a>.
    </div>
  )
}

export default Footer;
