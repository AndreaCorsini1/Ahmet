from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from API.choices import *


class BaseTest(APITestCase):

    def setUp(self):
        """

        """
        self.user = User.objects.create(username='test', is_staff=True)
        self.user.set_password('12345')
        self.user.save()

        self.client.force_login(self.user)

    def perform_test(self, url_tail, method='get', data=None):
        """

        :param url_tail:
        :param method:
        :param data:
        :return:
        """
        url = "http://localhost:8080/api/v0.1/{}/".format(url_tail)

        if method == 'post':
            response = self.client.post(path=url, data=data, format='json')
        elif method == 'put':
            response = self.client.put(path=url, data=data, format='json')
        elif method == 'delete':
            response = self.client.delete(path=url, data=data, format='json')
        elif method == 'get':
            response = self.client.get(path=url, data=data, format='json')
        else:
            raise NameError

        return response


class AlgorithmTests(BaseTest):

    def test_post(self):
        """
        Test post algorithm
        """
        data = {"name": "RandomSearch"}
        response = self.perform_test('algorithms', 'post', data)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], data['name'])

        response = self.perform_test('algorithms', 'post', {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = {"name": "fake_alg1", "status": "UNAVAILABLE"}
        response = self.perform_test('algorithms', 'post', data)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], data['status'])

    def test_unique(self):
        """
        Test duplicated algorithm's name
        """
        data = {"name": "fake_alg"}
        response = self.perform_test('algorithms', 'post', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], data['name'])

        response = self.perform_test('algorithms', 'post', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.perform_test('algorithms', 'get')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put(self):
        """
        Test method not supported
        """
        data = {"name": "fake_"}
        response = self.perform_test('algorithms', 'put', data)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        # print(response)

    def test_get(self):
        """
        Test get
        """
        response = self.perform_test('algorithms')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # print(response.data)


class MetricTests(BaseTest):

    def test_post(self):
        """
        Test post metric
        """
        data = {"name": "SimpleFunction"}
        response = self.perform_test('metrics', 'post', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], data['name'])

        # No name
        response = self.perform_test('metrics', 'post', {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Status
        data = {"name": "fake_m", "status": "UNAVAILABLE"}
        response = self.perform_test('metrics', 'post', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], data['status'])
        # print(response.data)

    def test_unique(self):
        """
        Test duplicated metric's name
        """
        data = {"name": "fake_alg"}
        response = self.perform_test('metrics', 'post', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], data['name'])

        response = self.perform_test('metrics', 'post', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # print(response)

    def test_put(self):
        """
        Test method not supported
        """
        data = {"name": "fake_"}
        response = self.perform_test('metrics', 'put', data)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        # print(response.data)

    def test_get(self):
        """
        Test get
        """
        response = self.perform_test('metrics')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # print(response.data)


class StudyTests(BaseTest):

    def populateDB(self):
        """
        Set the FK for study table.
        """
        data = {"name": "RandomSearch"}
        self.perform_test('algorithms', 'post', data)
        data["name"] = "SimpleFunction"
        self.perform_test('metrics', 'post', data)

    def test_post(self):
        """

        """
        self.populateDB()
        data = {
            'name': 'fake_stu',
            'owner': 'test',
            'objective': OBJECTIVE.MAXIMIZE.name
        }
        response = self.perform_test('studies', 'post', data)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.perform_test('parameters')
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get(self):
        """

        """
        self.populateDB()
        response = self.perform_test('studies')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # print(response.data)

        # Get specific study
        data = {
            'name': 'fake_stu',
            'objective': OBJECTIVE.MINIMIZE.name,
            'owner': 'test',
        }
        self.perform_test('studies', 'post', data)
        response = self.perform_test("studies/{}".format(data['name']))
        self.assertEqual(data['name'], response.data['name'])

    def test_update(self):
        """

        """
        self.populateDB()
        data = {
            'name': 'fake_stu1',
            'objective': OBJECTIVE.MINIMIZE.name,
            'owner': 'test'
        }
        response = self.perform_test('studies', 'post', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # print(response.data)

        # TODO: fix name
        data = {'name': 'fake_stu1', 'objective': OBJECTIVE.MINIMIZE.name,
                'status': 'Nooooo'}
        response = self.perform_test('studies/fake_stu1', 'put', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ParamTest(BaseTest):

    def populateDB(self):
        """
        Set the FK for param table.
        """
        data = {"name": "RandomSearch"}
        self.perform_test('algorithms', 'post', data)
        data["name"] = "SimpleFunction"
        self.perform_test('metrics', 'post', data)
        data = {
            'name': 'fake_stu',
            'objective': OBJECTIVE.MINIMIZE.name,
            'owner': 'test',
        }
        self.perform_test('studies', 'post', data)

    def test_post(self):
        """
        "params": [
                {
                    "name": "hidden1",
                    "type": TYPE.INTEGER.value,
                    "values": [1, 10],
                    "scalingType": "LINEAR"
                }, {
                    "name": "learning_rate",
                    "type": TYPE.DOUBLE.value,
                    "values": [0.01, 0.5],
                    "scalingType": "LINEAR"
                }, {
                    "name": "Optimizer",
                    "type": TYPE.CATEGORICAL.value,
                    "values": ["SGD", "RMSprop"]
                }
            ]
        :return:
        """
        self.populateDB()
        data = {
            "name": "hidden1",
            "study_name": 'fake_stu',
            "type": TYPE.INTEGER.name,
            "min": 1,
            "max": 10,
            "scalingType": "LINEAR"
        }
        response = self.perform_test('parameters', 'post', data)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
