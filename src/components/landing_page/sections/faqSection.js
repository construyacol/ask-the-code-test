import React, { useState, useEffect } from 'react'
import faq_list from '../../api/ui/faqs/faqs.json'
import { Link } from 'react-router-dom'
import Soundplayer from '../../widgets/sound_player/sound_player'

import '../css/sections.css'

const FaqSection = props => {

  const [ faqs, setFaqs ] = useState([])
  const [ currentFaq, setCurrentFaq ] = useState('1-1')
  const [ faq, setFaq ] = useState()

  useEffect(()=>{
    let country = 'colombia'
    let faqs = faq_list[country]


    if(props.landing){
      let new_faqs = []
      for (let i = 0; i <= 2; i++) {
        new_faqs.push(faqs[i])
      }
      faqs = new_faqs
    }

    setFaqs(faqs)


    let coordinates = '1-1'
    let position = coordinates.split('-')
    setFaq(faqs[(position[0]-1)].faqs[(position[1]-1)])

  },[])

  const selectFaq = (e) =>{
    setCurrentFaq(e.target.dataset.faq)
    let coordinates = e.target.dataset.faq
    let position = coordinates.split('-')
    setFaq(faqs[(position[0]-1)].faqs[(position[1]-1)])
  }


  return(
      <div className={`FaqSection ${props.landing ? 'landing' : '' }`}>

        <h1 className="fuente colorTitleLanding">Preguntas Frecuentes</h1>

        {
          props.landing &&
          <div className="seeMoreCont">
            <Link to="/docs/faqs">
              <p className="seeMore fuente">Ver mas preguntas frecuentes <i className="fas fa-arrow-right"></i></p>
            </Link>
          </div>
        }

        {
          !props.landing &&
          <Soundplayer className="help_section" current_sound={faq}/>
        }

          {
            faqs.length>0 && faqs.map((faq) => {
              return (
                <FaqSubSection key={faq.title} {...faq}  selectFaq={selectFaq} currentFaq={currentFaq}/>
              )
            })
          }
      </div>
  )

}


const FaqSubSection = props => {
  return(
    <div className="Faq">
      <h3 className="fuente colorTitleLanding">{props.title}</h3>
      {
        props.faqs.map(faq =>{
          return <FaqItem key={faq.id} {...faq} selectFaq={props.selectFaq} currentFaq={props.currentFaq}/>
        })
      }
    </div>
  )
}


const FaqItem = props => {
  let dataFaq = `${props.category_id}-${props.id}`
  // console.log('|||| ====> PROPS', props)
  return(
    <div onClick={props.selectFaq} className="FaqContainer">

      <div data-faq={dataFaq} className="areaClickFaq"></div>

      <div className="titleFaqCont">
        <div className={`moreFaq ${props.currentFaq === dataFaq ? 'active' : ''}`}>
          <span></span>
          <span></span>
        </div>
        <h4 className={`fuente colorTitleLanding titleCategoryFaq ${props.currentFaq === dataFaq ? 'active' : ''}`}>  {props.faq}</h4>
      </div>
      <div className={`FaqItem ${props.currentFaq === dataFaq ? 'active' : 'inctive'}`}>
        <p className={`fuente FaqItemText ${props.currentFaq === dataFaq ? 'active' : 'inctive'}`}>{props.answer}</p>
      </div>
    </div>
  )

}

export default FaqSection
