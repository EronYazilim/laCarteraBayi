import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs'
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators'

export class FakeBackendInterceptor implements HttpInterceptor {
	constructor() { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const users: any[] = JSON.parse(localStorage.getItem('users')) || [{ username: 'admin', email: 'admin@themesdesign.in', password: '123456' }]

		return of(null).pipe(mergeMap(() => {
			if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
				const filteredUsers = users.filter(user => {
					return user.email === request.body.email && user.password === request.body.password
				})
				if (filteredUsers.length) {
					const user = filteredUsers[0]
					const body = {
						id: user.id,
						email: user.email,
						username: user.username,
						firstName: user.firstName,
						lastName: user.lastName,
						token: 'fake-jwt-token'
					}

					return of(new HttpResponse({ status: 200, body }))
				} else {
					return throwError({ error: { message: 'Username or password is incorrect' } })
				}
			}

			if (request.url.endsWith('/users') && request.method === 'GET') {
				if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
					return of(new HttpResponse({ status: 200, body: users }))
				} else {
					return throwError({ status: 401, error: { message: 'Unauthorised' } })
				}
			}

			if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
				if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
					const urlParts = request.url.split('/')
					const id = parseInt(urlParts[urlParts.length - 1])
					const matchedUsers = users.filter(user => user.id === id)
					const user = matchedUsers.length ? matchedUsers[0] : null

					return of(new HttpResponse({ status: 200, body: user }))
				} else {
					return throwError({ status: 401, error: { message: 'Unauthorised' } })
				}
			}

			if (request.url.endsWith('/users/register') && request.method === 'POST') {
				const newUser = request.body

				const duplicateUser = users.filter(user => user.username === newUser.username).length
				if (duplicateUser) {
					return throwError({ error: { message: 'Username "' + newUser.username + '" is already taken' } })
				}

				newUser.id = users.length + 1
				users.push(newUser)
				localStorage.setItem('users', JSON.stringify(users))

				return of(new HttpResponse({ status: 200 }))
			}

			if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
				if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
					const urlParts = request.url.split('/')
					const id = parseInt(urlParts[urlParts.length - 1])
					for (let i = 0; i < users.length; i++) {
						const user = users[i]
						if (user.id === id) {
							users.splice(i, 1)
							localStorage.setItem('users', JSON.stringify(users))
							break
						}
					}

					return of(new HttpResponse({ status: 200 }))
				} else {
					return throwError({ status: 401, error: { message: 'Unauthorised' } })
				}
			}

			return next.handle(request)
		}))

		.pipe(materialize())
		.pipe(delay(500))
		.pipe(dematerialize())
	}
}