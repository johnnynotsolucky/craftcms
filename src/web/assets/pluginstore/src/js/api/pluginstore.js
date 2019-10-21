import axios from 'axios'

// create a cancel token for axios
let CancelToken = axios.CancelToken
let cancelTokenSource = CancelToken.source()

// create an axios instance
const _axios = axios.create({
    baseURL: process.env.VUE_APP_CRAFT_API_ENDPOINT,
    headers: window.apiHeaders,
    cancelToken: cancelTokenSource.token,
})

export default {
    /**
     * Cancel requests.
     */
    cancelRequests() {
        // cancel requests
        cancelTokenSource.cancel()

        // create a new cancel token
        cancelTokenSource = CancelToken.source()

        // update axios with the new cancel token
        _axios.defaults.cancelToken = cancelTokenSource.token
    },

    /**
     * Get plugin store data.
     *
     * @returns {AxiosPromise<any>}
     */
    getCoreData() {
        return _axios.get('plugin-store/core-data')
    },

    /**
     * Get developer.
     *
     * @param developerId
     * @returns {AxiosPromise<any>}
     */
    getDeveloper(developerId) {
        return _axios.get('developer/' + developerId)
    },

    /**
     * Get featured section by handle.
     *
     * @param featuredSectionHandle
     * @returns {AxiosPromise<any>}
     */
    getFeaturedSectionByHandle(featuredSectionHandle) {
        return _axios.get('plugin-store/featured-section/' + featuredSectionHandle)
    },

    /**
     * Get featured sections.
     *
     * @returns {AxiosPromise<any>}
     */
    getFeaturedSections() {
        return _axios.get('plugin-store/featured-sections')
    },

    /**
     * Get plugin changelog.
     *
     * @param pluginId
     * @returns {AxiosPromise<any>}
     */
    getPluginChangelog(pluginId) {
        return _axios.get('plugin/' + pluginId + '/changelog')
    },

    /**
     * Get plugin details.
     *
     * @param pluginId
     * @returns {AxiosPromise<any>}
     */
    getPluginDetails(pluginId) {
        return _axios.get('plugin/' + pluginId)
    },

    /**
     * Get plugin details by handle.
     *
     * @param pluginHandle
     * @returns {AxiosPromise<any>}
     */
    getPluginDetailsByHandle(pluginHandle) {
        return _axios.get('plugin-store/plugin/' + pluginHandle)
    },

    /**
     * Get plugins by category.
     *
     * @param categoryId
     * @param pluginIndexParams
     * @returns {AxiosPromise<any>}
     */
    getPluginsByCategory(categoryId, pluginIndexParams) {

        const params = this._getPluginIndexParams(pluginIndexParams)

        return _axios.get('plugin-store/plugins-by-category/' + categoryId, {
            params
        })
    },

    /**
     * Get plugins by developer ID.
     *
     * @param developerId
     * @param pluginIndexParams
     * @returns {AxiosPromise<any>}
     */
    getPluginsByDeveloperId(developerId, pluginIndexParams) {
        const params = this._getPluginIndexParams(pluginIndexParams)

        return _axios.get('plugin-store/plugins-by-developer/' + developerId, {
            params
        })
    },

    /**
     * Get plugins by featured section handle.
     *
     * @param featuredSectionHandle
     * @param pluginIndexParams
     * @returns {AxiosPromise<any>}
     */
    getPluginsByFeaturedSectionHandle(featuredSectionHandle, pluginIndexParams) {
        const params = this._getPluginIndexParams(pluginIndexParams)

        return _axios.get('plugin-store/plugins-by-featured-section/' + featuredSectionHandle, {
            params
        })
    },

    /**
     * Get plugins by handles.
     *
     * @param pluginHandles
     * @returns {AxiosPromise<any>}
     */
    getPluginsByHandles(pluginHandles) {
        let pluginHandlesString

        if (Array.isArray(pluginHandles)) {
            pluginHandlesString = pluginHandles.join(',')
        } else {
            pluginHandlesString = pluginHandles
        }

        return _axios.get('plugin-store/plugins-by-handles', {
            params: {
                pluginHandles: pluginHandlesString
            }
        })
    },

    /**
     * Get plugins by IDs.
     *
     * @param pluginIds
     * @returns {AxiosPromise<any>}
     */
    getPluginsByIds(pluginIds) {
        let pluginIdsString

        if (Array.isArray(pluginIds)) {
            pluginIdsString = pluginIds.join(',')
        } else {
            pluginIdsString = pluginIds
        }

        return _axios.get('plugins', {
            params: {
                ids: pluginIdsString
            }
        })
    },

    /**
     * Search plugins.
     *
     * @param searchQuery
     * @param pluginIndexParams
     * @returns {AxiosPromise<any>}
     */
    searchPlugins(searchQuery, pluginIndexParams) {
        const params = this._getPluginIndexParams(pluginIndexParams)
        params.searchQuery = searchQuery

        return _axios.get('plugin-store/search-plugins', {
            params
        })
    },

    /**
     * Get plugin index params.
     *
     * @param limit
     * @param offset
     * @param orderBy
     * @param direction
     * @returns {{offset: *, limit: *, orderBy: *, direction: *}}
     * @private
     */
    _getPluginIndexParams({limit, offset, orderBy, direction}) {
        if (!limit) {
            limit = 48
        }

        if (!offset) {
            offset = 0
        }

        return {
            limit,
            offset,
            orderBy,
            direction
        }
    },
}
