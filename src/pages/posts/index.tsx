import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

export default function Posts() {
    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    <a href='#'>
                        <time>12 de março de 2022</time>
                        <strong>JAMstack: geleia de JavaScript, API e Markup</strong>
                        <p>
                            O que significa e por que é considerada uma arquitetura moderna de desenvolvimento web?
                        
                            Uma arquitetura moderna de desenvolvimento, vista como vanguarda na renascença de web sites estáticos, e com nome de um doce popularmente conhecido como GELEIA.
                        </p>
                    </a>
                    <a href='#'>
                        <time>12 de março de 2022</time>
                        <strong>JAMstack: geleia de JavaScript, API e Markup</strong>
                        <p>
                            O que significa e por que é considerada uma arquitetura moderna de desenvolvimento web?
                        
                            Uma arquitetura moderna de desenvolvimento, vista como vanguarda na renascença de web sites estáticos, e com nome de um doce popularmente conhecido como GELEIA.
                        </p>
                    </a>
                    <a href='#'>
                        <time>12 de março de 2022</time>
                        <strong>JAMstack: geleia de JavaScript, API e Markup</strong>
                        <p>
                            O que significa e por que é considerada uma arquitetura moderna de desenvolvimento web?
                        
                            Uma arquitetura moderna de desenvolvimento, vista como vanguarda na renascença de web sites estáticos, e com nome de um doce popularmente conhecido como GELEIA.
                        </p>
                    </a>
                </div>
            </main>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();

    const response = await prismic.getAllByType('Post', {
        fetch: ['Post.title', 'Post.content'],
        pageSize: 100
    });

    console.log(response);

    return {
        props: {}
    }
}