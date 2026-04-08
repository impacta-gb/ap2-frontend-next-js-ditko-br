import NavButton from "./NavButton"

export default function Nav(){
    return(
        <nav>
            <NavButton text='Devolução'></NavButton>
            <NavButton text='Local'></NavButton>
            <NavButton text='Item'></NavButton>
            <NavButton text='Reclamante'></NavButton>
            <NavButton text='Responsavel'></NavButton>
        </nav>
    )
}