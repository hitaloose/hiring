import { FormEvent, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { Container } from '../../components/container'
import { Header } from '../../components/header'
import { Button } from '../../components/button'
import { DateField } from '../../components/date-field'
import { TextField } from '../../components/text-field'
import { Loading } from '../../components/loading'

import { FilterContainer, Title, DataContainer } from './styles'
import { api } from '../../services/api'
import { formatDate, formatPrice } from '../../helpers/format'

export interface PurchasedDataApi {
  name: string;
  purchasedAmount: number;
  purchasedAt: string;
  priceAtDate: number;
  lastPrice: number;
  capitalGains: number;
}

export const Gains = () => {
  /**
   * Hooks
   */
  const { goBack } = useHistory()
  const { stockName } = useParams<{ stockName: string }>()

  /**
   * States
   */
  const [loading, setLoading] = useState(false)
  const [purchasedData, setPurchasedData] = useState({} as PurchasedDataApi)
  const [purchasedAt, setPurchasedAt] = useState(new Date())
  const [purchasedAmount, setPurchasedAmount] = useState<number>(0)

  /**
   * Functions
   */
  const checkForm = () => {
    if (!purchasedAt) {
      return 'Data da compra é obrigatório'
    }
    if (!purchasedAmount) {
      return 'Quantidade de compra é obrigatório'
    }

    return null
  }

  /**
   * Handles
   */
  const handleBackClick = () => {
    goBack()
  }

  const handlePurchasedAmountChange = (value: string) => {
    setPurchasedAmount(Number(value))
  }

  const handleSearchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const errorMessage = checkForm()

    if (errorMessage) {
      alert(errorMessage)
      return
    }

    try {
      setLoading(true)
      const { data } = await api.get(`/stocks/${stockName}/gains`, {
        params: { purchasedAmount, purchasedAt }
      })
      setPurchasedData(data)
    } catch (err) {
      alert(err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Returns
   */

  if (loading) {
    return <Loading />
  }

  return (
    <Container>
      <Header>
        <Button onClick={handleBackClick}>Voltar</Button>
        <Title>{stockName}</Title>
      </Header>

      <FilterContainer onSubmit={handleSearchSubmit}>
        <DateField
          required
          marginRight={10}
          label="Data de compra"
          value={purchasedAt}
          onDateChange={setPurchasedAt}
        />
        <TextField
          required
          marginRight={10}
          label="Quantidade de compra"
          value={purchasedAmount}
          onTextChange={handlePurchasedAmountChange}
        />
        <Button type="submit">Pesquisar</Button>
      </FilterContainer>

      <DataContainer>
        <p>Quantidade de compra: {purchasedData.purchasedAmount}</p>
        <p>Data da compra: {formatDate(purchasedData.purchasedAt)}</p>
        <p>
          Preço na compra:{' '}
          {purchasedData.priceAtDate
            ? formatPrice(purchasedData.priceAtDate)
            : ''}
        </p>
        <p>
          Preço atual:{' '}
          {purchasedData.lastPrice ? formatPrice(purchasedData.lastPrice) : ''}
        </p>
        <p>
          Ganhos:{' '}
          {purchasedData.capitalGains
            ? formatPrice(purchasedData.capitalGains)
            : ''}
        </p>
      </DataContainer>
    </Container>
  )
}
