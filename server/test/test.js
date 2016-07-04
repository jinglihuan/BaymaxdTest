var _ = require('lodash')

var chakram = require('chakram'),
	expect = chakram.expect

var baseUrl = 'http://101.201.197.11:8090/api/v1'

describe('prebaymax api', function() {
	it('Get list of body part', function() {
		var resp = chakram.get(baseUrl + '/meta/body_parts')
		expect(resp).to.have.status(200)
		expect(resp).to.have.schema({
			properties: {
				id: 'number',
				code: 'string',
				name_cn: "string"
			},
			required: ['id', 'code', 'name_cn']
		})
		return chakram.wait()
	})

	it('Get all available symptoms from system library', function() {
		var resp = chakram.get(baseUrl + '/meta/symptoms?user_agent={user_agent}&sex=male&age=20&body_part={body_part}')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Lookup details about a single symptom', function() {
		var resp = chakram.get(baseUrl + '/meta/symptoms/headache')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('List available medical test sets', function() {
		var resp = chakram.get(baseUrl + '/meta/test_sets')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Get reference ranges about a test result', function() {
		var resp = chakram.get(baseUrl + '/meta/tests/{test}/ranges?sex=male&age=20')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Register a person', function() {
		var resp = chakram.post(baseUrl + '/persons')
		expect(resp).to.have.status(201)
		return chakram.wait()
	})

	it('Get a person\'s basic profile', function() {
		var resp = chakram.get(baseUrl + '/persons/1/profile')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('update a person\'s basic profile', function() {
		var resp = chakram.put(baseUrl + '/persons/1/profile', {
			Blood_type: 'A'
		})
		expect(resp).to.have.status(204)
		return chakram.wait()
	})

	it('Delete a person\'s all profiles', function() {
		var resp = chakram.delete(baseUrl + '/persons/1')
		expect(resp).to.have.status(201)
		return chakram.wait()
	})

	it('Add symptoms of a person', function() {
		var resp = chakram.post(baseUrl + '/persons/1/symptoms', {
			id: 1
		})
		expect(resp).to.have.status(201)
		return chakram.wait()
	})

	it('Get a person\'s all symptoms', function() {
		var resp = chakram.get(baseUrl + '/persons/1/symptoms?is_active=true')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('update a symptom', function() {
		var resp = chakram.put(baseUrl + '/persons/1/symptoms/2', {
			symptom: 'headache'
		})
		expect(resp).to.have.status(204)
		return chakram.wait()
	})

	it('Remove a symptom of a person', function() {
		var resp = chakram.delete(baseUrl + '/persons/1/symptoms/2')
		expect(resp).to.have.status(204)
		return chakram.wait()
	})

	it('Diagnose a person based on current health profile', function() {
		var resp = chakram.post(baseUrl + '/persons/1/diagnose')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Get next inputs for further diagnosis', function() {
		var resp = chakram.get(baseUrl + '/person/1/next_inputs')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Get list categories of drugs', function() {
		var resp = chakram.get(baseUrl + '/drug_categories')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	// it('Get list drugs', function() {
	// 	var resp = chakram.get(baseUrl + '/drugs?category={category}')
	// 	expect(resp).to.have.status(200)
	// 	return chakram.wait()
	// })

	it('Check any drugs/foods for interaction', function() {
		var resp = chakram.post(baseUrl + '/interaction/check', {
			type: "drug",
			id: 10101
		})
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Creates a new survey instance for a person', function() {
		var resp = chakram.post(baseUrl + '/persons/1/surveys', {
			prototype_id: 10101
		})
		expect(resp).to.have.status(201)
		return chakram.wait()
	})

	it('Get list answered surveys by a person', function() {
		var resp = chakram.get(baseUrl + '/persons/1/surveys?last={last}')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Retrieve an answered survey by a person for human review', function() {
		var resp = chakram.get(baseUrl + '/persons/1/surveys/2')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Update a single survey instance', function() {
		var resp = chakram.put(baseUrl + '/persons/1/surveys/2')
		expect(resp).to.have.status(204)
		return chakram.wait()
	})

	it('Delete a single survey instance', function() {
		var resp = chakram.delete(baseUrl + '/persons/1/surveys/2')
		expect(resp).to.have.status(204)
		return chakram.wait()
	})

	it('Creates a new prototype question', function() {
		var resp = chakram.post(baseUrl + '/meta/survey_questions', {
			question: "How tall are you in cm?",
			condition: "physical/height",
			type: "scalar",
			input_control: "textbox"
		})
		expect(resp).to.have.status(201)
		return chakram.wait()
	})

	it('Get a single prototype question', function() {
		var resp = chakram.get(baseUrl + '/meta/survey_questions/1')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Deletes a prototype question', function() {
		var resp = chakram.delete(baseUrl + '/meta/survey_questions/1')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Get list all survey questions in system library', function() {
		var resp = chakram.get(baseUrl + '/meta/survey_questions')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Creates a survey prototype', function() {
		var resp = chakram.post(baseUrl + '/surveys')
		expect(resp).to.have.status(201)
		return chakram.wait()
	})

	it('Get list survey prototypes in system library', function() {
		var resp = chakram.get(baseUrl + '/surveys')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Get a single survey prototype', function() {
		var resp = chakram.get(baseUrl + '/surveys/1')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Update a survey prototype', function() {
		var resp = chakram.put(baseUrl + '/surveys/1')
		expect(resp).to.have.status(204)
		return chakram.wait()
	})
	it('Delete a survey prototype', function() {
		var resp = chakram.delete(baseUrl + '/surveys/1')
		expect(resp).to.have.status(204)
		return chakram.wait()
	})


})