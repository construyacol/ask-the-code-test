import { WebService } from "./WebService";
import { appLoadLabelAction } from "../loader";
import { loadLabels, INDETITY_URL, INDENTITY_USERS_URL, INDETITY_COUNTRY_VALIDATORS_URL, INDETITY_UPDATE_PROFILE_URL, GET_PROFILE_URL, ADD_PROFILE_URL } from "./const";
import userDefaultState from '../components/api'
import { objectToArray, addIndexToRootObject } from "../../services";
import normalizeUser from "../../schemas";
import { verificationStateAction } from "../uiActions";
import Environment from "../../environment";
import { updateNormalizedDataAction } from "../dataModelActions";

export class CoinsendaIndetityService extends WebService {
    async getUser(token, userCountry, userId, email, restoreId) {
        await this.dispatch(appLoadLabelAction(loadLabels.CARGANDO_TU_INFORMACION))

        const finalUrlFirst = `${INDETITY_URL}?country=${userCountry}`

        const firstResponse = await this.Get(finalUrlFirst)

        if (!firstResponse) { return false }

        const finalUrlSecond = `${INDENTITY_USERS_URL}/${userId}/status`
        const secondResponse = await this.Get(finalUrlSecond)

        let country_object = await addIndexToRootObject(secondResponse.countries)
        let country = await objectToArray(country_object)

        let updatedUser = {
            ...userDefaultState,
            email,
            restoreId,
            id: secondResponse.userId,
            country: country[0].value,
            verification_level: country[0].verification_level,
            verification_error: country[0].errors && country[0].errors[0],
            levels: country[0].levels
        }

        let kyc_personal = country[0].levels && country[0].levels.personal
        let kyc_identity = country[0].levels && country[0].levels.identity
        let kyc_financial = country[0].levels && country[0].levels.financial

        if (kyc_personal) {
            updatedUser.security_center.kyc.basic = kyc_personal
        }

        if (kyc_identity) {
            updatedUser.security_center.kyc.advanced = kyc_identity
        }

        if (kyc_financial) {
            updatedUser.security_center.kyc.financial = kyc_financial
        }

        const finalUrlThird = `${INDENTITY_USERS_URL}/${userId}/profiles`
        let thirdResponse = await this.Get(finalUrlThird)

        if (thirdResponse && thirdResponse.length > 0) {
            // Agregamos la información al modelo usuario (updatedUser)
            updatedUser = {
                ...updatedUser,
                ...thirdResponse[0].personal,
                person_type: thirdResponse[0].person_type
            }
        }

        let normalizedUser = await normalizeUser(updatedUser)
        await this.dispatch(updateNormalizedDataAction(normalizedUser))

        return normalizedUser
    }

    async updateUser(newUser) {
        newUser = await normalizeUser(newUser)
        return this.dispatch(updateNormalizedDataAction(newUser))
    }

    async getVerificationState() {
        const { user } = this.state.user.modelData
        if (!user) { return false }
        const { advanced, basic } = user.security_center.kyc
        let status = 'pending'
        if (advanced === basic) {
            status = !advanced ? null : advanced
        }

        await this.dispatch(verificationStateAction(status))

        return status
    }

    async countryValidators() {

        let response = await this.Get(INDETITY_COUNTRY_VALIDATORS_URL)
        if (!response || response === 465 || response === 404) { return false }
        let countries = await addIndexToRootObject(response[0].levels.level_1.personal.natural.country)

        let countriesAsArray = await objectToArray(countries)
        let countriesObject = {
            res: response[0],
            countries,
            country_list: countriesAsArray
        }

        return countriesObject
    }

    updateLevelProfile(user, config) {
        let body = {
            "data": {
                "country": user.country,
                "person_type": user.person_type,
                "info_type": config.info_type,
                "verification_level": config.verification_level,
                "info": config.info
            }
        }

        return this.Post(INDETITY_UPDATE_PROFILE_URL, body, user.userToken)
    }

    getCountryList() {
        return this.Get(`${Environment.CountryApIUrl}countrys`)
    }

    async userVerificationStatus(level) {

        const { user } = this.state.modelData
        const { advanced, basic, financial } = user.security_center.kyc

        switch (level) {
            case 'level_1':
                return advanced === 'accepted' && basic === 'accepted'
            case 'level_2':
                return advanced === 'accepted' && basic === 'accepted' && financial === 'accepted'
            default:
                return false
        }
    }

    async getProfile(userId, token) {
        return this.Get(`${GET_PROFILE_URL}/${userId}/profile`)
    }

    async addNewProfile(country, token) {
        let body = {
            "data": {
                "country": country
            }
        }

        let response = await this.Post(ADD_PROFILE_URL, body, token)
        if (!response) { return false }

        const { data } = response

        return data
    }
}