import { Githubuser } from "./GithubUser.js"


class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)

        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    delete(user) {
        const filterEntries = this.entries.filter(entry => entry.login !== user.login) 
        
        this.entries = filterEntries
    

        this.update()
        this.favoritesEmpty()
        this.save()

        console.log(this.entries.length)
        console.log(this.trEmpty)

    }

    favoritesEmpty() {
        const trEmpty = document.querySelector('tbody .tr-empty')
        
        const listQnt = this.entries.length
        
        console.log(listQnt)

        console.log(this.trEmpty)

        if(listQnt > 0) {
            trEmpty.classList.add('hidden')
        } else {
            trEmpty.classList.remove('hidden')
        }
    }

}








export class FavoritesViews extends Favorites{
    constructor(root) {
        super(root)

        this.tbody = document.querySelector('table tbody')

        this.trEmpty = document.querySelector('tbody .tr-empty')

        this.update()

        this.onAdd()
    }

    onAdd() {
        const addButton = this.root.querySelector('header button')

        addButton.addEventListener('click', () => {
            const {value} = this.root.querySelector('header input')
            
            this.add(value)
        })
    }

    async add(username) {

        try{
            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('Usuário já adicionado!')
            }
            const user = await Githubuser.search(username)
            
            if(user.login === undefined) {
                throw new Error('Usuário não localizado!')
            }

            this.entries = [user, ...this.entries]
    
            this.update()
    
            this.save()

        } catch(error) {
            alert(error.message)
        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach((user) => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.followers').textContent = user.followers
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.remove').addEventListener('click', () => {
                const isOk = confirm('Tem certeza que deseja deletar esse usuário?')
                if(isOk) {
                    this.delete(user)
                }
            })

            this.tbody.append(row)
            this.favoritesEmpty()
        })
    }

    createRow() {
        const tr = document.createElement('tr')
        
        tr.innerHTML = `
        <tr>
            <td class="user">
                <img src="https://github.com/maykbrito.png" alt="">

                <a href="https://github.com/maykbrito" target="_blank">
                    <p>Mayk Brito</p>
                    <span>maykbrito</span>
                </a>
                
            </td>

            <td class="repositories">
                0
            </td>

            <td class="followers">
                0
            </td>
            
            <td>
                <button class="remove">Remover</button>
            </td>
        </tr>
        `
        tr.classList.add('tr-lines')

        return tr
    }

    removeAllTr() {

        this.tbody.querySelectorAll('.tr-lines').forEach((tr) => {
            tr.remove()
        })
    }
    
}



