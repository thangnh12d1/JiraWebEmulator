import React from 'react'
import { useSelector } from 'react-redux'
import { selectIssueByKey } from '../slices/issues'
import { Label } from '@windmill/react-ui'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.bubble.css'
import { Card, CardBody } from '@windmill/react-ui'

export const ViewIssue = ({ match }) => {
  const { key } = match.params
  const issue = useSelector((state) => selectIssueByKey(state, key))
  if (!issue) return <p className="m-10">Please redirect to Issues tab. </p>
  let inputFields
  if (issue.Fields && issue.Fields.length !== 0) {
    inputFields = issue.Fields.map((item) => (
      <p className="text-white bg-purple-600" key={item.Name}>
        <span>{`${item.Name}: `}</span>
        <span className="ml-20 text-1xl font-semibold leading-tight">{`${item.Value}`}</span>
      </p>
    ))
  }
  return (
    <div className="container mx-auto px-4 mb-16 sm:px-8">
      <div className="py-8">
        <div className="mb-5 my-2">
          <Card className="mb-8 shadow-md text-sm text-gray-600 dark:text-gray-400">
            <CardBody>
              <div>
                Projects / <span>{issue.Project_Name}</span> /{' '}
                <span>{issue.Issue_Type_Name} / </span> <span>{issue.Key}</span>
              </div>
              <div className="flex">
                <div className="flex-auto">
                  <p className="text-3xl font-semibold leading-tight">
                    {issue.Name}
                  </p>
                  <div>
                    <Label>
                      <span>Description:</span>
                    </Label>
                    <ReactQuill
                      theme="bubble"
                      value={issue.Description}
                      readOnly={true}
                    />
                  </div>
                </div>
                <div className="flex w-1/4">
                  <div className="w-full">
                    <p className="m-2 ml-4 text-1xl font-semibold text-purple-500">
                      {issue.Status}
                    </p>
                    <Card colored className="text-white bg-purple-600">
                      <CardBody>
                        <p className="mb-4 text-2xl font-semibold">Details</p>
                        {inputFields}
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
