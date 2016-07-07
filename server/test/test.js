101
var _ = require('lodash')

var chakram = require('chakram'),
	expect = chakram.expect

var baseUrl = 'http://10.180.2.100:8090/api/v1'

describe("get or update person's  profiles", function() {
	var person = "57736390b374f1560c4a595f"
	this.timeout(10000)
	it('Get all available symptoms from system library', function() {
		var resp = chakram.get(baseUrl + '/meta/symptoms?user_agent={user_agent}&sex=male&age=20&body_part={body_part}')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	this.timeout(10000)
	it('Lookup details about a single symptom', function() {
		var resp = chakram.get(baseUrl + '/meta/symptoms/ ')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Not found details about a single symptom', function() {
		var resp = chakram.get(baseUrl + '/meta/symptoms/headache')
		expect(resp).to.have.status(404)
		return chakram.wait()
	})
	it('List available medical test sets', function() {
		var resp = chakram.get(baseUrl + '/meta/test_sets')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Get prototype of a single test set', function() {
		var resp = chakram.get(baseUrl + '/meta/test_sets/blood_test')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Get reference ranges about a test result', function() {
		var resp = chakram.get(baseUrl + '/meta/tests/57736390b374f1560c4a595f/ranges?sex=male&age=1990-01-01')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Add symptoms of a person', function() {
		var resp = chakram.post(baseUrl + '/persons/' + person + '/symptoms', {
			"code": "",
			"name_cn": "心搏和呼吸停止",
			"aliases_cn": [],
			"chinesePinYin": "xinbohehuxitingzhi",
			"shortPinYin": "x",
			"symptomSex": ""
		})
		expect(resp).to.have.status(201)
		return chakram.wait()
	})

	it('Not found symptoms of a person', function() {
		var resp = chakram.post(baseUrl + '/persons/' + person + '/symptoms', {
			symptoms: ["headache", "fever"],
			since: "2017-01-01",
		})
		expect(resp).to.have.status(404)
		return chakram.wait()
	})

	it('Get a person\'s all symptoms', function() {
		var resp = chakram.get(baseUrl + '/persons/5773937db0c15d1119154697/symptoms?is_active=true')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Not found a person\'s all symptoms', function() {
		var resp = chakram.get(baseUrl + '/persons/' + person + '/symptoms?is_active=true')
		expect(resp).to.have.status(404)
		return chakram.wait()
	})

	it('update a symptom', function() {
		var resp = chakram.put(baseUrl + '/persons/' + person + '/symptoms/5779ff0bb374f1560c4a6daa', {
			symptom: 'headache',
			since: "2017-02-01",
			is_active: false
		})
		expect(resp).to.have.status(204)
		return chakram.wait()
	})

	it('Get a single test set of a person', function() {
		var resp = chakram.get(baseUrl + '/person/' + person + '/test_sets/57736390b374f1560c4a595f')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Add or update one or more test results', function() {
		var resp = chakram.post(baseUrl + '/person/' + person + '/conditions', {
			condition: "blood_test/WBC",
			value: 5.5
		})
		expect(resp).to.have.status(201)
		return chakram.wait()
	})

	it('Diagnose a person based on current health profile', function() {
		var resp = chakram.post(baseUrl + '/persons/' + person + '/diagnose')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Get list categories of drugs', function() {
		var resp = chakram.get(baseUrl + '/drug_categories')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Get list drugs', function() {
		var resp = chakram.get(baseUrl + '/drugs?category=5774bd19b374f1560c4a5964')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Check any drugs/foods for interaction', function() {
		var resp = chakram.post(baseUrl + '/interaction/check', {
			type: "drug",
			id: 10101
		})
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Creates a new survey instance for a person', function() {
		var resp = chakram.post(baseUrl + '/persons/' + person + '/surveys', {
			prototype_id: 10101
		})
		expect(resp).to.have.status(201)
		return chakram.wait()
	})

	it('Get list answered surveys by a person', function() {
		var resp = chakram.get(baseUrl + '/persons/' + person + '/surveys?last={last}')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Retrieve an answered survey by a person for human review', function() {
		var resp = chakram.get(baseUrl + '/persons/57736390b374f1560c4a5960/surveys/5774e035cb4dd93f23b13806')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Update a single survey instance', function() {
		var resp = chakram.put(baseUrl + '/persons/5779ff0bb374f1560c4a6da9/surveys/5779ff0bb374f1560c4a6daa')
		expect(resp).to.have.status(204)
		return chakram.wait()
	})

	it('Creates a new prototype question', function() {
		var resp = chakram.post(baseUrl + '/meta/survey_questions', {
			"question": "How tall are you in cm?",
			"condition": "physical/height",
			"type": "scalar",
			"input_control": "textbox"
		})
		expect(resp).to.have.status(201)
		return chakram.wait()
	})

	it('Get a single prototype question', function() {
		var resp = chakram.get(baseUrl + '/meta/survey_questions/5774d8095d7e1da82244a116')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Get list all survey questions in system library', function() {
		var resp = chakram.get(baseUrl + '/meta/survey_questions')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Creates a survey prototype', function() {
		var resp = chakram.post(baseUrl + '/surveys', {
			title: "Example Survey",
			description: "Some text to describe the survey...",
			content: [{
				question: "How tall are you in cm?",
				condition: "physical/height",
				type: "scalar",
				input_control: "textbox"
			}, {
				question: "Do you smoke?",
				condition: "habits/is_smoke",
				type: "boolean",
				input_control: "checkbox"
			}, ]
		})
		expect(resp).to.have.status(201)
		return chakram.wait()
	})

	it('Get list survey prototypes in system library', function() {
		var resp = chakram.get(baseUrl + '/surveys')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Get a single survey prototype', function() {
		var resp = chakram.get(baseUrl + '/surveys/5774e035cb4dd93f23b13806')
		expect(resp).to.have.status(200)
		return chakram.wait()
	})

	it('Update a survey prototype', function() {
		var resp = chakram.put(baseUrl + '/surveys/5779ff0bb374f1560c4a6da9')
		expect(resp).to.have.status(204)
		return chakram.wait()
	})
});

describe("Person", function() {
	it("Register", function() {
		var person = {
			"sex": "male",
			"birthday": "1997-03-01",
			"blood_type": "AB"
		}
		return chakram.post(baseUrl + '/persons', person)
			.then(function(getProfile) {
				var personId = getProfile.body.id;
				expect(getProfile).to.have.status(201)
				return chakram.get(baseUrl + "/persons/" + personId + "/profile");
			})
			.then(function(updateProfile) {
				var personId1 = updateProfile.body.id;
				expect(updateProfile).to.have.status(200)
				return chakram.put(baseUrl + "/persons/" + personId1 + "/profile");
			})
	})
});

describe("Delete Person", function() {
	this.timeout(10000);
	it("Delete Person", function() {
		var person = {
			"sex": "male",
			"birthday": "1992-04-08",
			"blood_type": "O"
		}
		return chakram.post(baseUrl + '/persons', person)
			.then(function(getProfile) {
				var personId = getProfile.body.id;
				expect(getProfile).to.have.status(201)
				return chakram.get(baseUrl + "/persons/" + personId + "/profile");
			})
			.then(function(deleteProfile) {
				var personId2 = deleteProfile.body.id;
				expect(deleteProfile).to.have.status(200)
				return chakram.delete(baseUrl + "/persons/" + personId2);
			})
	})
});

//根据患者档案诊断
describe("Diagnose a person based on current health profile", function() {
	it("Register", function() {
		var person = {
			"sex": "male",
			"birthday": "2015-05-06",
			"blood_type": "O"
		}
		return chakram.post(baseUrl + '/persons', person)
			.then(function(addSymptoms) {
				var personId = addSymptoms.body.id;
				expect(addSymptoms).to.have.status(201)
				expect(addSymptoms.body.blood_type).to.contain("O");
				return chakram.post(baseUrl + "/persons/" + personId + "/symptoms", {
					symptoms: ["fever", "headache"],
					since: "2006-01-01",
				});
			})
			.then(function(diagnose) {
				var personId1 = diagnose.body.id;
				expect(diagnose.body.disease.name).to.contain("感冒");
				return chakram.post(baseUrl + "/person/" + personId1 + "/diagnose");
			})
	});
});

describe("Remove a symptom of a person", function() {
	it("Register", function() {
		var person = {
			"sex": "male",
			"birthday": "1889-05-06",
			"blood_type": "O"
		}
		return chakram.post(baseUrl + '/persons', person)
			.then(function(addSymptoms) {
				var personId = addSymptoms.body.id;
				expect(addSymptoms).to.have.status(201)
				return chakram.post(baseUrl + "/persons/" + personId + "/symptoms", {
					symptoms: ["fever"],
					since: "1968-04-01",
				});
			})
			.then(function(removeSymptoms) {
				var personId1 = removeSymptoms.body.id;
				var symptomId = removeSymptoms.body.id
				return chakram.delete(baseUrl + "/persons/" + personId1 + "/symptoms/" + symptomId);
			})
	});
});
// describe("Person for condition record", function() {
// 	it("Register", function() {
// 		var person = {
// 			"sex": "male",
// 			"birthday": "1992-01-016",
// 			"blood_type": "O"
// 		}
// 		return chakram.post(baseUrl + '/persons', person)
// 			.then(function(getProfile) {
// 				var personId = getProfile.body.id;
// 				expect(getProfile).to.have.status(201)
// 				return chakram.get(baseUrl + "/persons/" + personId + "/profile");
// 			})
// 			.then(function(deleteRecord) {
// 				var personId1 = deleteRecord.body.id;
// 				return chakram.delete(baseUrl + "/person/" + personId1 + "/conditions/");
// 				//无 conditions id
// 			})
// 	});
// });



// describe("Get a single test set of a person", function() {
// 	it("Register", function() {
// 		var person = {
// 			"sex": "male",
// 			"birthday": "1990-01-01",
// 			"blood_type": "AB"
// 		}
// 		return chakram.post(baseUrl + '/persons', person)
// 			.then(function(getProfile) {
// 				var personId = getProfile.body.id;
// 				expect(getProfile).to.have.status(201)
// 				return chakram.get(baseUrl + "/persons/" + personId + "/profile");
// 			})
// 			.then(function(getTest) {
// 				var personId1 = getTest.body.id;
// 				return chakram.put(baseUrl + "/persons/" + personId1 + "/test_sets/{test_set}");
// 			})
// 			.then(function(addTest) {
// 				var personId2 = addTest.body.id;
// 				var results = {
// 					condition: "blood_test/WBC",
// 					value: 5.5,
// 				}
// 				return chakram.post(baseUrl + "/persons/" + personId2 + "/conditions", results);
// 			})
// 	})
// });

// describe("Delete a condition record", function() {
// 	it("Register", function() {
// 		var person = {
// 			"sex": "male",
// 			"birthday": "1990-01-01",
// 			"blood_type": "O"
// 		}
// 		return chakram.post(baseUrl + '/persons', person)
// 			.then(function(getProfile) {
// 				var personId = getProfile.body.id;
// 				expect(getProfile).to.have.status(201)
// 				return chakram.get(baseUrl + "/persons/" + personId + "/profile");
// 			})
// 			.then(function(getTest) {
// 				var personId1 = getTest.body.id;
// 				return chakram.put(baseUrl + "/persons/" + personId1 + "/test_sets/{test_set}");
// 			})
// 			.then(function(deleteTest) {
// 				var personId2 = deleteTest.body.id;
// 				return chakram.delete(baseUrl + "/persons/" + personId2 + "/conditions/id");
// 			})
// 	})
// });

// describe("Delete a condition record", function() {
// 	it('Get list categories of drugs', function() {
// 		var resp = chakram.get(baseUrl + '/drug_categories')
// 		expect(resp).to.have.status(200)
// 		return chakram.wait()
// 	})

// 	it('Get list drugs', function() {
// 		var resp = chakram.get(baseUrl + '/drugs?category={category}')
// 		return chakram.wait()
// 	})

// 	it('Check any drugs/foods for interaction', function() {
// 		var resp = chakram.post(baseUrl + '/interaction/check', {
// 			type: "drug",
// 			id: 10101
// 		})
// 		return chakram.wait()
// 	})
// });