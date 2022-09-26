const handlers = require('../handlers')

test('renderiza página principal', () => {
    const req = {}
    const res = { render: jest.fn() }
    handlers.home(req, res)
    expect(res.render.mock.calls[0][0]).toBe('home')
})

test('renderiza página sobre com a mensagem do dia', () => {
    const req = {}
    const res = { render: jest.fn() }
    handlers.sobre(req, res)
    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('sobre')
    expect(res.render.mock.calls[0][1])
    .toEqual(expect.objectContaining({
        fortune: expect.stringMatching(/\W/),
    }))
})

test('renderiza manipulador 404', () => {
    const req = {}
    const res = { render: jest.fn() }
    handlers.notFound(req, res)
    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('404')
})

test('renderiza manipulador 500', () => {
    const err = new Error('Algum erro')
    const req = {}
    const res = { render: jest.fn() }
    const next = jest.fn()
    handlers.serverError(err, req, res, next)
    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('500')
})