### EXPRESS SESSION MANAGER

Este es un módulo creado para manejar sesiones en express, con el fin de que sea más fácil el manejo de sesiones en express.

El módulo está configurado según las buenas prácticas de seguridad sugeridas por el equipo de seguridad. Para más información sobre las buenas prácticas de seguridad en express, visite [este enlace](https://expressjs.com/en/advanced/best-practice-security.html).

#### Instalación

npm i session-manager-express

#### Uso

```typescript
import { SessionHandler } form 'session-manager-express';

app.use(SessionHandler.create());
```

#### Puedes configurar tus propios "Authorizers"

Los authorizers son funciones que se ejecutan en la función `SessionHandler.validateSession` y que permiten validar si la sesión es válida o no. Por ejemplo, puedes crear un authorizer que valide si el usuario está activo o no.

```typescript

const authorizers: Authorizer[] = [
	(session: Session) => {
		if (session.user.active) {
			return true;
		}
		return false;
	}
];

SessionHandler.registerAuthorizers(authorizers);
```

Es importante que recuerdes que los authorizers se ejecutan en el orden en el que fueron registrados.

#### Puedes configurar tu logger personalizado

```typescript
SessionHandler.setLogger(logger);
```

#### Tienes que redefinir la interfaz `Session`

```typescript
declare module 'session-manager-express' {
	interface Session {
		user: User;
	}
}
```

De esta forma puedes acceder a tus propios datos de sesión.
