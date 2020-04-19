import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'

import EventCreate from './views/EventCreate.vue'
import EventList from './views/EventList.vue'
import EventShow from './views/EventShow.vue'
import NotFound from '@/components/NotFound'
import NetworkIssue from '@/components/NetworkIssue'

import store from '@/store/store'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'event-list',
            component: EventList,
            props: true
        },
        {
            path: '/event/:id',
            name: 'event-show',
            component: EventShow,
            props: true,
            beforeEnter(routeTo, routeFrom, next) {
                store.dispatch('fetchEvent', routeTo.params.id)
                .then(event => {
                    routeTo.params.event = event
                    next()
                })
                .catch(error => {
                    if (error.response && error.response.status === '404'){
                        next({ name: '404', params: { resource: 'event' } })
                    } else {
                        next({ name: 'network-issue' })
                    }
                })
            }
        },
        {
            path: '/event/create',
            name: 'event-create',
            component: EventCreate
        },
        {
            path: '/network-issue',
            name: 'network-issue',
            component: NetworkIssue,
            props: true
        },
        {
            path: '/404',
            name: '404',
            component: NotFound,
            props: true
        },
        {
            path: '*',
            redirect: { name: '404', params: { resource: 'page' } }
        }  
    ]
})

router.beforeEach((routeTo, routeFrom, next) => {
    NProgress.start()
    next()
})

router.afterEach(() => {
    NProgress.done()
})

export default router