import React  from 'react';
import { Container, Nav } from 'react-bootstrap';

export class MainMenuItem {
    text: string = '';
    link: string = '#';

    constructor(text: string, link: string) {
        this.text = text;
        this.link = link;
    }
}

interface MainMenuProperties {
    items: MainMenuItem[];
}

interface MainMenuState {
    items: MainMenuItem[]; // moze imati color, background itd..
}

export class MainMenu extends React.Component<MainMenuProperties>{
    state: MainMenuState;

    constructor(props: Readonly<MainMenuProperties>) {
        super(props)
    
        this.state = {
          items: props.items,   
        };

        setInterval(() => {
            const novaLista = [...this.state.items];
            novaLista.push(new MainMenuItem("Naslov", "/link"));
            this.setItems(novaLista);
        }, 2000);
    }
    
    setItems(items: MainMenuItem[]) {
        this.setState({
            items: items,
        });
    }
    
    render() {
        return (
            <Container>
                <Nav variant="tabs">
                    { this.state.items.map(this.makeNavLink) }
                </Nav>
            </Container>
        );
    }

    private makeNavLink(item: MainMenuItem) {
        return (
            <Nav.Link href={ item.link }>{ item.text }</Nav.Link>
        );
    }
}