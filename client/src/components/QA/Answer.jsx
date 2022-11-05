import React from 'react'
import {PropTypes} from 'prop-types'
import {Questions, HelpfulButton, AnswerWrapper, AnswerStyle} from './assets/styles.js'
import {format, parseISO} from 'date-fns'
import Helpful from './Helpful.jsx'
import Images from './Images.jsx'
import axios from 'axios'
import AddAnswer from './AddAnswer.jsx'

const {useState, useEffect} = React;



const Answer = ({questionid, shouldFetchQ, setShouldFetchQ, openAModal, shouldFetchA, searchedQ}) => {

  //states and variables
  const [answers, setAnswers] = useState([])
  const [renderA, setRenderA] = useState([])
  const [hide, setHide] = useState(true)
  const [end, setEnd] = useState(2)

  const start = 0;

  //hooks & handlers
  useEffect(()=> {
    //axios.get(`/qa/questions/${questionid}/answers`)
    axios.get(`localhost:3001/qa/questions/${questionid}/answers`)
    .then((res)=>{
      setAnswers(res.data.results)
      setRenderA(res.data.results.slice(start, end))
    })
    .catch((error)=>{
      console.error(error)
    })

  }, [shouldFetchA])

  useEffect(()=> {
    if (renderA.length === answers.length) {
      setHide(false)
    } else {
      setHide(true)
    }
  }, [renderA])

  const helpfulAnswerOnclick = (iD) => {

    const config = {params: {answer_id: iD}}
    //axios.put('/qa/answers/:answer_id/helpful', {}, config)
    axios.put(`localhost:3001/qa/answers/:answer_id/helpful`, {}, config)
    .then((success) => {
    })
    .catch((error) => {

    })

  }

  const reportAnswerOnclick = (iD) => {

    const config = {params: {answer_id: iD}}
    //axios.put('/qa/answers/:answer_id/report', {}, config)
    axios.put(`localhost:3001/qa/answers/:answer_id/report`, {}, config)
    .then((success) => {

      //axios.get(`/qa/questions/${questionid}/answers`)
      axios.get(`localhost:3001/qa/questions/${questionid}/answers`)
        .then((res)=>{
          setAnswers(res.data.results)
          setRenderA(res.data.results.slice(start, end))
        })
        .catch((error)=>{
          console.error(error)
        })
      setShouldFetchQ(!shouldFetchQ)
    })
    .catch((error) => {

    })

  }

  const handleMoreAnswers = () => {
    setRenderA(answers.slice(start, renderA.length + 2))
  }

  //component
  return (
      <>
        {renderA.map(function (currentAnswer, index) {
          return (
          <Questions key={index}>
          <AnswerWrapper>
          <div>
            <AnswerStyle>
            <span className= 'answer'>{` ${currentAnswer.body}`}</span>
            </AnswerStyle>
            <div>
              <Images images={currentAnswer.photos} />
              <span className='user'>{`by ${currentAnswer.answerer_name}, `}</span>
              <span>{format(parseISO(`${currentAnswer.date}`), 'MMMM d, yyyy  |  ')}</span>
              <Helpful helpfulCount={currentAnswer.helpfulness} id={currentAnswer.answer_id} helpfulHandler={helpfulAnswerOnclick} reportHandler={reportAnswerOnclick}/>
            </div>
          </div>
          </AnswerWrapper>
          </Questions >
          )
        })}
        {/* Add answer button goes here*/}
        <AddAnswer openAModal={openAModal}/>
        {hide ? <button onClick={handleMoreAnswers}> Load More Answers </button> : <span> No more answers...</span>}
      </>

  )
}

//proptypes
Answer.propTypes = {
  questionid: PropTypes.number,
  shouldFetchQ: PropTypes.bool,
  setShouldFetchQ: PropTypes.func,
  openAModal: PropTypes.func,
  shouldFetchA: PropTypes.bool,
  searchedQ: PropTypes. array
}

export default Answer
